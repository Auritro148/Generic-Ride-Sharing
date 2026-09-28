<template>
  <div class="dashboard">

    <!-- ================= HEADER ================= -->

    <header class="header">

      <div class="brand">
        <h1>Rooda</h1>
        <span>Driver Dashboard</span>
      </div>

      <div class="header-right">

        <div class="connection">
          <span
            class="connection-dot"
            :class="socketStatus === 'Connected' ? 'connected' : 'disconnected'"
          ></span>

          {{ socketStatus }}
        </div>

        <button
          class="logout-btn"
          @click="logout"
          :disabled="loading"
        >
          Logout
        </button>

      </div>

    </header>


    <!-- ================= MAIN ================= -->

    <main class="main-content">

      <!-- ================= STATUS CARD ================= -->

      <section class="status-card">

        <div class="status-header">

          <div>
            <p class="small-title">DRIVER STATUS</p>

            <div class="status-title">

              <span
                class="status-dot"
                :class="isOnline ? 'online' : 'offline'"
              ></span>

              <h2>
                {{ isOnline ? "You are Online" : "You are Offline" }}
              </h2>

            </div>

          </div>


          <button
            class="status-btn"
            :class="isOnline ? 'go-offline' : 'go-online'"
            @click="toggleStatus"
            :disabled="loading"
          >
            {{
              loading
                ? "Processing..."
                : isOnline
                  ? "Go Offline"
                  : "Go Online"
            }}
          </button>

        </div>


        <div class="status-info">

          <div class="info-item">
            <span>WebSocket</span>
            <strong>{{ socketStatus }}</strong>
          </div>

          <div class="info-item">
            <span>Latitude</span>
            <strong>
              {{ latitude !== null ? latitude.toFixed(6) : "Not available" }}
            </strong>
          </div>

          <div class="info-item">
            <span>Longitude</span>
            <strong>
              {{ longitude !== null ? longitude.toFixed(6) : "Not available" }}
            </strong>
          </div>

        </div>

      </section>


      <!-- ================= MESSAGE ================= -->

      <div
        v-if="message"
        class="message"
        :class="messageType"
      >
        {{ message }}
      </div>


      <!-- ================= RIDE REQUEST ================= -->

      <section
        v-if="rideRequest"
        class="ride-section"
      >

        <div class="section-title">

          <div>
            <p class="small-title">NEW REQUEST</p>
            <h2>Ride Request</h2>
          </div>

          <span class="new-badge">
            NEW
          </span>

        </div>


        <div class="ride-card">

          <!-- Ride ID -->

          <div class="ride-top">

            <div>
              <span class="label">Request ID</span>

              <strong>
                #{{ rideRequest.req_id }}
              </strong>
            </div>

            <div class="distance">

              <span class="label">Distance</span>

              <strong>
                {{ formatDistance(rideRequest.distance_meters) }}
              </strong>

            </div>

          </div>

          <!--fare-->
          <div class="ride-details">

            <div class="detail">
              <span>Estimated Fare</span>

              <strong>
                ৳{{ rideRequest.est_fare ?? "N/A" }}
              </strong>
            </div>

          </div>


          <!-- Location -->

          <div class="location-container">

            <div class="location-row">

              <div class="location-icon pickup">
                ●
              </div>

              <div class="location-text">

                <span class="label">
                  PICKUP
                </span>

                <strong>
                  {{ getPickupLocation() }}
                </strong>

              </div>

            </div>


            <div class="location-line"></div>


            <div class="location-row">

              <div class="location-icon destination">
                ●
              </div>

              <div class="location-text">

                <span class="label">
                  DESTINATION
                </span>

                <strong>
                  {{ getDestinationLocation() }}
                </strong>

              </div>

            </div>

          </div>


          <!-- Extra details -->

          <div class="ride-details">

            <div
              v-if="rideRequest.fare !== undefined"
              class="detail"
            >
              <span>Estimated Fare</span>

              <strong>
                ৳{{ rideRequest.fare }}
              </strong>
            </div>


            <div
              v-if="rideRequest.passenger_name"
              class="detail"
            >
              <span>Passenger</span>

              <strong>
                {{ rideRequest.passenger_name }}
              </strong>
            </div>

          </div>


          <!-- Buttons -->

          <div class="ride-actions">

            <button
              class="decline-btn"
              @click="declineRide"
              :disabled="rideLoading"
            >
              Decline
            </button>

            <button
              class="accept-btn"
              @click="acceptRide"
              :disabled="rideLoading"
            >
              {{ rideLoading ? "Processing..." : "Accept Ride" }}
            </button>

          </div>

        </div>

      </section>


      <!-- ================= NO REQUEST ================= -->

      <section
        v-else
        class="empty-card"
      >

        <div class="empty-icon">
          🚕
        </div>

        <h3>No Ride Requests</h3>

        <p>
          {{
            isOnline
              ? "You are online. New ride requests will appear here."
              : "Go online to receive ride requests."
          }}
        </p>

      </section>

    </main>

  </div>
</template>


<script setup>

import {
  ref,
  onBeforeUnmount
} from "vue";

import { useRouter } from "vue-router";


/* =========================================
   CONFIG
========================================= */

const API_BASE_URL = "http://localhost:5000";

const WS_URL = "ws://localhost:5000/core/driver/ws";


/* =========================================
   ROUTER
========================================= */

const router = useRouter();


/* =========================================
   STATE
========================================= */

const isOnline = ref(false);

const loading = ref(false);

const rideLoading = ref(false);

const socketStatus = ref("Disconnected");

const latitude = ref(null);

const longitude = ref(null);

const message = ref("");

const messageType = ref("");

const rideRequest = ref(null);

let socket = null;


/* =========================================
   LOCATION
========================================= */

function getCurrentLocation() {

  return new Promise((resolve, reject) => {

    if (!navigator.geolocation) {

      reject(
        new Error(
          "Geolocation is not supported by this browser"
        )
      );

      return;
    }


    navigator.geolocation.getCurrentPosition(

      (position) => {

        resolve({
          lat: position.coords.latitude,
          long: position.coords.longitude
        });

      },

      (error) => {

        reject(error);

      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }

    );

  });

}


/* =========================================
   TOGGLE STATUS
========================================= */

function toggleStatus() {

  if (isOnline.value) {

    goOffline();

  } else {

    goOnline();

  }

}


/* =========================================
   GO ONLINE
========================================= */

async function goOnline() {

  if (isOnline.value) {
    return;
  }


  loading.value = true;

  clearMessage();


  try {

    const token =
      localStorage.getItem("token");


    if (!token) {

      throw new Error(
        "JWT token not found"
      );

    }


    const location =
      await getCurrentLocation();


    latitude.value =
      location.lat;

    longitude.value =
      location.long;


    const response =
      await fetch(
        `${API_BASE_URL}/core/driver/setStatus`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },

          body: JSON.stringify({
            mode: "online",
            lat: location.lat,
            long: location.long
          })
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Failed to go online"
      );

    }


    isOnline.value = true;


    showMessage(
      data.message ||
      "You are now online",
      "success"
    );


    connectWebSocket(token);

  }


  catch (error) {

    console.error(
      "Go online error:",
      error
    );


    showMessage(
      error.message ||
      "Failed to go online",
      "error"
    );

  }


  finally {

    loading.value = false;

  }

}


/* =========================================
   WEBSOCKET
========================================= */

function connectWebSocket(token) {

  if (socket) {

    socket.close();

    socket = null;

  }


  socketStatus.value =
    "Connecting...";


  const wsUrl =
    `${WS_URL}?token=${encodeURIComponent(token)}`;


  socket =
    new WebSocket(wsUrl);


  /* -----------------------------------------
     CONNECTED
  ----------------------------------------- */

  socket.onopen = () => {

    console.log(
      "WEBSOCKET CONNECTED"
    );


    socketStatus.value =
      "Connected";

  };


  /* -----------------------------------------
     MESSAGE
  ----------------------------------------- */

  socket.onmessage =
    (event) => {

      console.log(
        "WEBSOCKET MESSAGE:",
        event.data
      );


      try {

        const data =
          JSON.parse(event.data);


        /* -------------------------------------
           Connection
        ------------------------------------- */

        if (
          data.type ===
          "connection_established"
        ) {

          socketStatus.value =
            "Connected";

        }


        /* -------------------------------------
           Ride request
        ------------------------------------- */

        if (
          data.type ===
          "ride_request"
        ) {

          console.log(
            "NEW RIDE REQUEST",
            data
          );


          rideRequest.value =
            data.data;


          showMessage(
            "New ride request received",
            "success"
          );

        }


        /* -------------------------------------
           Pong
        ------------------------------------- */

        if (
          data.type ===
          "pong"
        ) {

          console.log(
            "Pong received"
          );

        }

      }


      catch (error) {

        console.error(
          "Message parse error:",
          error
        );

      }

    };


  /* -----------------------------------------
     ERROR
  ----------------------------------------- */

  socket.onerror =
    (error) => {

      console.error(
        "WEBSOCKET ERROR:",
        error
      );


      socketStatus.value =
        "Error";

    };


  /* -----------------------------------------
     CLOSE
  ----------------------------------------- */

  socket.onclose =
    (event) => {

      console.log(
        "WEBSOCKET CLOSED",
        event.code,
        event.reason
      );


      socketStatus.value =
        "Disconnected";


      socket = null;

    };

}


/* =========================================
   GO OFFLINE
========================================= */

async function goOffline() {

  if (!isOnline.value) {
    return;
  }


  loading.value = true;

  clearMessage();


  try {

    const token =
      localStorage.getItem("token");


    if (!token) {

      throw new Error(
        "JWT token not found"
      );

    }


    const response =
      await fetch(
        `${API_BASE_URL}/core/driver/setStatus`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },

          body: JSON.stringify({
            mode: "offline"
          })
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Failed to go offline"
      );

    }


    isOnline.value = false;


    showMessage(
      data.message ||
      "You are now offline",
      "success"
    );


    disconnectWebSocket();


  }


  catch (error) {

    console.error(
      "Go offline error:",
      error
    );


    showMessage(
      error.message ||
      "Failed to go offline",
      "error"
    );

  }


  finally {

    loading.value = false;

  }

}


/* =========================================
   DISCONNECT WEBSOCKET
========================================= */

function disconnectWebSocket() {

  if (socket) {

    console.log(
      "Closing driver WebSocket..."
    );


    socket.close();


    socket = null;

  }


  socketStatus.value =
    "Disconnected";

}


/* =========================================
   ACCEPT RIDE
========================================= */

async function acceptRide() {

  if (!rideRequest.value) {
    return;
  }


  rideLoading.value = true;


  try {

    const rideId =
      rideRequest.value.req_id;


    console.log(
      "Accepting ride:",
      rideId
    );


    /*
     * Backend accept API ekhane add korbe.
     *
     * Example:
     *
     * await fetch(
     *   `${API_BASE_URL}/core/ride/accept`,
     *   ...
     * );
     */


    /*
     * আপাতত next page-এ পাঠাচ্ছি।
     */

    router.push(
      `/driver/ride/${rideId}`
    );

  }


  catch (error) {

    console.error(
      "Accept ride error:",
      error
    );


    showMessage(
      "Failed to accept ride",
      "error"
    );

  }


  finally {

    rideLoading.value = false;

  }

}


/* =========================================
   DECLINE RIDE
========================================= */

function declineRide() {

  if (!rideRequest.value) {
    return;
  }


  console.log(
    "Declined ride:",
    rideRequest.value.req_id
  );


  rideRequest.value = null;


  showMessage(
    "Ride request declined",
    "success"
  );

}


/* =========================================
   LOGOUT
========================================= */

async function logout() {

  loading.value = true;


  try {

    /*
     * First disconnect WebSocket
     */

    disconnectWebSocket();


    /*
     * If driver is online,
     * make driver offline.
     */

    const token =
      localStorage.getItem("token");


    if (
      token &&
      isOnline.value
    ) {

      try {

        await fetch(
          `${API_BASE_URL}/core/driver/setStatus`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              "Authorization":
                `Bearer ${token}`
            },

            body: JSON.stringify({
              mode: "offline"
            })
          }
        );

      }

      catch (error) {

        console.error(
          "Failed to set driver offline during logout:",
          error
        );

      }

    }


    /*
     * Clear local state
     */

    isOnline.value = false;

    rideRequest.value = null;


    /*
     * Remove authentication
     */

    localStorage.removeItem(
      "token"
    );


    /*
     * Go to login
     */

    router.push("/signin");

  }


  catch (error) {

    console.error(
      "Logout error:",
      error
    );

  }


  finally {

    loading.value = false;

  }

}


/* =========================================
   LOCATION TEXT
========================================= */

function getPickupLocation() {

  if (!rideRequest.value) {
    return "Pickup location";
  }


  return (
    rideRequest.value.pickup?.name ||
    rideRequest.value.pickup?.address ||
    (
      rideRequest.value.pickup?.latitude !== undefined &&
      rideRequest.value.pickup?.longitude !== undefined
        ? `${rideRequest.value.pickup.latitude}, ${rideRequest.value.pickup.longitude}`
        : "Pickup location"
    )
  );

}


function getDestinationLocation() {
  if (!rideRequest.value) {
    return "Destination";
  }

  return (
    rideRequest.value.dropoff?.name ||
    rideRequest.value.dropoff?.address ||
    (
      rideRequest.value.dropoff?.latitude !== undefined &&
      rideRequest.value.dropoff?.longitude !== undefined
        ? `${rideRequest.value.dropoff.latitude}, ${rideRequest.value.dropoff.longitude}`
        : "Destination"
    )
  );
}

/* =========================================
   DISTANCE
========================================= */

function formatDistance(meters) {

  if (
    meters === undefined ||
    meters === null
  ) {

    return "N/A";

  }


  if (meters < 1000) {

    return `${Math.round(meters)} m`;

  }


  return `${(
    meters / 1000
  ).toFixed(1)} km`;

}


/* =========================================
   MESSAGE
========================================= */

function showMessage(
  text,
  type
) {

  message.value = text;

  messageType.value = type;

}


function clearMessage() {

  message.value = "";

  messageType.value = "";

}


/* =========================================
   CLEANUP
========================================= */

onBeforeUnmount(() => {

  disconnectWebSocket();

});

</script>


<style scoped>

* {
  box-sizing: border-box;
}


.dashboard {
  min-height: 100vh;
  min-width: 100vw;
  background: #f5f7fb;
  color: #1d2433;
}


/* =========================================
   HEADER
========================================= */

.header {
  height: 72px;
  background: white;
  border-bottom: 1px solid #e8ebf0;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 40px;
}


.brand {
  display: flex;
  align-items: baseline;
  gap: 12px;
}


.brand h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.5px;
}


.brand span {
  color: #8991a1;
  font-size: 14px;
}


.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}


.connection {
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  color: #596273;
}


.connection-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}


.connection-dot.connected {
  background: #16a34a;
}


.connection-dot.disconnected {
  background: #9ca3af;
}


.logout-btn {
  border: none;
  background: #f1f3f6;
  color: #333b4d;

  padding: 9px 17px;
  border-radius: 8px;

  font-weight: 600;
  cursor: pointer;
}


.logout-btn:hover {
  background: #e5e8ed;
}


/* =========================================
   MAIN
========================================= */

.main-content {
  width: min(900px, 92%);
  margin: 40px auto;
}


/* =========================================
   STATUS CARD
========================================= */

.status-card {
  background: white;
  border-radius: 16px;
  padding: 28px;

  box-shadow:
    0 4px 20px rgba(20, 30, 50, 0.06);
}


.status-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}


.small-title {
  margin: 0 0 7px;

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;

  color: #9098a8;
}


.status-title {
  display: flex;
  align-items: center;
  gap: 11px;
}


.status-title h2 {
  margin: 0;

  font-size: 22px;
  font-weight: 700;
}


.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}


.status-dot.online {
  background: #16a34a;
  box-shadow: 0 0 0 5px #dcfce7;
}


.status-dot.offline {
  background: #ef4444;
  box-shadow: 0 0 0 5px #fee2e2;
}


.status-btn {
  min-width: 130px;

  border: none;
  border-radius: 9px;

  padding: 12px 20px;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;
}


.go-online {
  background: #16a34a;
  color: white;
}


.go-online:hover {
  background: #15803d;
}


.go-offline {
  background: #ef4444;
  color: white;
}


.go-offline:hover {
  background: #dc2626;
}


.status-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


/* =========================================
   STATUS INFO
========================================= */

.status-info {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);

  gap: 12px;

  margin-top: 28px;
}


.info-item {
  background: #f7f8fa;
  border-radius: 10px;
  padding: 13px 15px;
}


.info-item span {
  display: block;

  font-size: 12px;
  color: #8b94a5;

  margin-bottom: 5px;
}


.info-item strong {
  font-size: 14px;
}


/* =========================================
   MESSAGE
========================================= */

.message {
  margin-top: 16px;

  padding: 13px 16px;

  border-radius: 9px;

  font-size: 14px;
}


.message.success {
  background: #ecfdf3;
  color: #15803d;
}


.message.error {
  background: #fef2f2;
  color: #dc2626;
}


/* =========================================
   RIDE SECTION
========================================= */

.ride-section {
  margin-top: 32px;
}


.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 14px;
}


.section-title h2 {
  margin: 0;

  font-size: 22px;
}


.new-badge {
  background: #fff7ed;
  color: #ea580c;

  font-size: 11px;
  font-weight: 800;

  padding: 6px 10px;

  border-radius: 20px;
}


/* =========================================
   RIDE CARD
========================================= */

.ride-card {
  background: white;

  border-radius: 16px;

  padding: 26px;

  box-shadow:
    0 4px 20px rgba(20, 30, 50, 0.07);
}


.ride-top {
  display: flex;
  justify-content: space-between;

  padding-bottom: 20px;

  border-bottom: 1px solid #edf0f4;
}


.label {
  display: block;

  color: #939bab;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.7px;

  margin-bottom: 5px;
}


.ride-top strong {
  font-size: 15px;
}


.distance {
  text-align: right;
}


/* =========================================
   LOCATION
========================================= */

.location-container {
  padding: 25px 5px;
}


.location-row {
  display: flex;
  align-items: center;

  gap: 15px;
}


.location-icon {
  width: 28px;
  height: 28px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
}


.location-icon.pickup {
  background: #dcfce7;
  color: #16a34a;
}


.location-icon.destination {
  background: #fee2e2;
  color: #ef4444;
}


.location-text strong {
  font-size: 15px;
}


.location-line {
  width: 1px;
  height: 25px;

  background: #d9dde5;

  margin-left: 14px;
}


/* =========================================
   DETAILS
========================================= */

.ride-details {
  display: flex;
  gap: 12px;

  margin-bottom: 20px;
}


.detail {
  flex: 1;

  background: #f7f8fa;

  border-radius: 9px;

  padding: 12px 14px;
}


.detail span {
  display: block;

  font-size: 11px;
  color: #9299a8;

  margin-bottom: 4px;
}


.detail strong {
  font-size: 14px;
}


/* =========================================
   ACTIONS
========================================= */

.ride-actions {
  display: flex;
  gap: 12px;
}


.ride-actions button {
  flex: 1;

  border: none;

  padding: 13px;

  border-radius: 9px;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;
}


.decline-btn {
  background: #f1f3f6;
  color: #4b5563;
}


.decline-btn:hover {
  background: #e5e7eb;
}


.accept-btn {
  background: #16a34a;
  color: white;
}


.accept-btn:hover {
  background: #15803d;
}


.ride-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


/* =========================================
   EMPTY CARD
========================================= */

.empty-card {
  margin-top: 32px;

  background: white;

  border-radius: 16px;

  padding: 50px 30px;

  text-align: center;

  box-shadow:
    0 4px 20px rgba(20, 30, 50, 0.05);
}


.empty-icon {
  font-size: 38px;
  margin-bottom: 10px;
}


.empty-card h3 {
  margin: 0 0 8px;

  font-size: 18px;
}


.empty-card p {
  margin: 0;

  color: #8a92a2;

  font-size: 14px;
}


/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 650px) {

  .header {
    padding: 0 18px;
  }


  .brand span {
    display: none;
  }


  .connection {
    display: none;
  }


  .main-content {
    width: 94%;
    margin: 25px auto;
  }


  .status-card {
    padding: 20px;
  }


  .status-header {
    align-items: flex-start;
    gap: 15px;
    flex-direction: column;
  }


  .status-btn {
    width: 100%;
  }


  .status-info {
    grid-template-columns: 1fr;
  }


  .ride-card {
    padding: 20px;
  }


  .ride-details {
    flex-direction: column;
  }


  .ride-actions {
    flex-direction: column;
  }

}

</style>