```vue
<template>
  <div class="ride-request-page">

    <!-- LEFT SIDE -->
    <div class="ride-panel">

      <h1>Request a Ride</h1>
      <p class="subtitle">
        Choose your pickup and destination
      </p>

      <!-- Pickup -->
      <div class="location-box">
        <div class="location-icon pickup-icon">
          A
        </div>

        <div class="location-info">
          <span class="location-label">Pickup Location</span>

          <span v-if="pickup">
            {{ pickup.lat.toFixed(6) }},
            {{ pickup.lng.toFixed(6) }}
          </span>

          <span v-else class="placeholder">
            Click on the map to select pickup
          </span>
        </div>
      </div>

      <!-- Destination -->
      <div class="location-box">
        <div class="location-icon destination-icon">
          B
        </div>

        <div class="location-info">
          <span class="location-label">Destination</span>

          <span v-if="destination">
            {{ destination.lat.toFixed(6) }},
            {{ destination.lng.toFixed(6) }}
          </span>

          <span v-else class="placeholder">
            Click on the map to select destination
          </span>
        </div>
      </div>

      <!-- Instructions -->
      <div class="instruction">
        <strong>{{ instructionTitle }}</strong>
        <p>{{ instructionText }}</p>
      </div>

      <!-- Route Information -->
      <div v-if="routeDistance !== null" class="route-info">

        <div class="route-item">
          <span class="route-label">Distance</span>
          <strong>{{ routeDistance }} km</strong>
        </div>

        <div class="route-item">
          <span class="route-label">Estimated Time</span>
          <strong>{{ routeDuration }} min</strong>
        </div>

      </div>

      <!-- Buttons -->
      <div class="button-group">

        <button
          class="location-button"
          @click="useCurrentLocation"
          :disabled="loadingLocation"
        >
          {{ loadingLocation ? "Getting location..." : "Use My Location" }}
        </button>

        <button
          class="reset-button"
          @click="resetRide"
        >
          Reset
        </button>

      </div>

      <!-- Request Ride -->
      <button
        class="request-button"
        @click="requestRide"
        :disabled="!pickup || !destination || requestingRide"
      >
        {{ requestingRide ? "Requesting..." : "Request Ride" }}
      </button>

      <!-- Success -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <!-- Error -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

    </div>

    <!-- MAP -->
    <div class="map-container">

      <div id="ride-map"></div>

      <div class="map-help">
        <strong>How to select locations</strong>

        <span v-if="!pickup">
          Click anywhere on the map to select pickup.
        </span>

        <span v-else-if="!destination">
          Now click another location for destination.
        </span>

        <span v-else>
          Pickup and destination selected.
        </span>
      </div>

    </div>

  </div>
</template>


<script setup>

import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


/* =========================
   CONFIG
========================= */

const API_URL = "http://localhost:3000";


/* =========================
   REACTIVE DATA
========================= */

const map = ref(null);

const pickup = ref(null);
const destination = ref(null);

const pickupMarker = ref(null);
const destinationMarker = ref(null);

const routeLine = ref(null);

const routeDistance = ref(null);
const routeDuration = ref(null);

const loadingLocation = ref(false);
const requestingRide = ref(false);

const errorMessage = ref("");
const successMessage = ref("");


/* =========================
   INSTRUCTIONS
========================= */

const instructionTitle = computed(() => {

  if (!pickup.value) {
    return "Step 1";
  }

  if (!destination.value) {
    return "Step 2";
  }

  return "Ready";
});


const instructionText = computed(() => {

  if (!pickup.value) {
    return "Click on the map to select your pickup location.";
  }

  if (!destination.value) {
    return "Click on the map to select your destination.";
  }

  return "Your route is ready. You can request the ride.";
});


/* =========================
   DEFAULT MAP LOCATION
   Dhaka
========================= */

const DEFAULT_LAT = 23.8103;
const DEFAULT_LNG = 90.4125;
const DEFAULT_ZOOM = 13;


/* =========================
   INITIALIZE MAP
========================= */

function initializeMap() {

  map.value = L.map("ride-map").setView(
    [DEFAULT_LAT, DEFAULT_LNG],
    DEFAULT_ZOOM
  );


  /*
   * OpenStreetMap tiles
   */

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }
  ).addTo(map.value);


  /*
   * Handle map clicks
   */

  map.value.on("click", handleMapClick);
}


/* =========================
   MAP CLICK
========================= */

function handleMapClick(event) {

  errorMessage.value = "";
  successMessage.value = "";


  const lat = event.latlng.lat;
  const lng = event.latlng.lng;


  /*
   * First click = pickup
   */

  if (!pickup.value) {

    setPickup(lat, lng);

    return;
  }


  /*
   * Second click = destination
   */

  if (!destination.value) {

    setDestination(lat, lng);

    return;
  }


  /*
   * If both already exist,
   * clicking again resets destination
   */

  setDestination(lat, lng);
}


/* =========================
   SET PICKUP
========================= */

function setPickup(lat, lng) {

  pickup.value = {
    lat,
    lng
  };


  /*
   * Remove old marker
   */

  if (pickupMarker.value) {
    map.value.removeLayer(pickupMarker.value);
  }


  /*
   * Create pickup marker
   */

  pickupMarker.value = L.marker(
    [lat, lng]
  )
    .addTo(map.value)
    .bindPopup("Pickup Location")
    .openPopup();


  /*
   * If destination already exists,
   * redraw route
   */

  if (destination.value) {
    getRoute();
  }
}


/* =========================
   SET DESTINATION
========================= */

function setDestination(lat, lng) {

  destination.value = {
    lat,
    lng
  };


  /*
   * Remove old destination marker
   */

  if (destinationMarker.value) {
    map.value.removeLayer(destinationMarker.value);
  }


  /*
   * Create destination marker
   */

  destinationMarker.value = L.marker(
    [lat, lng]
  )
    .addTo(map.value)
    .bindPopup("Destination")
    .openPopup();


  /*
   * Get route
   */

  if (pickup.value) {
    getRoute();
  }
}


/* =========================
   GET ROUTE FROM OSRM
========================= */

async function getRoute() {

  if (!pickup.value || !destination.value) {
    return;
  }


  errorMessage.value = "";


  try {

    /*
     * IMPORTANT:
     * OSRM expects:
     *
     * longitude,latitude
     *
     * NOT:
     *
     * latitude,longitude
     */

    const start =
      `${pickup.value.lng},${pickup.value.lat}`;

    const end =
      `${destination.value.lng},${destination.value.lat}`;


    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${start};${end}` +
      `?overview=full&geometries=geojson`;


    const response = await fetch(url);


    if (!response.ok) {
      throw new Error("Unable to get route");
    }


    const data = await response.json();


    if (data.code !== "Ok" || !data.routes.length) {
      throw new Error("No route found");
    }


    const route = data.routes[0];


    /*
     * Distance is returned in meters
     */

    routeDistance.value =
      (route.distance / 1000).toFixed(2);


    /*
     * Duration is returned in seconds
     */

    routeDuration.value =
      Math.ceil(route.duration / 60);


    /*
     * Remove previous route
     */

    if (routeLine.value) {
      map.value.removeLayer(routeLine.value);
    }


    /*
     * Draw route
     */

    routeLine.value = L.geoJSON(
      route.geometry,
      {
        style: {
          weight: 5,
          opacity: 0.8
        }
      }
    ).addTo(map.value);


    /*
     * Fit map to route
     */

    map.value.fitBounds(
      routeLine.value.getBounds(),
      {
        padding: [40, 40]
      }
    );

  } catch (error) {

    console.error(error);

    errorMessage.value =
      "Could not calculate the route.";

    routeDistance.value = null;
    routeDuration.value = null;
  }
}


/* =========================
   USE CURRENT LOCATION
========================= */

function useCurrentLocation() {

  errorMessage.value = "";
  successMessage.value = "";


  if (!navigator.geolocation) {

    errorMessage.value =
      "Geolocation is not supported by your browser.";

    return;
  }


  loadingLocation.value = true;


  navigator.geolocation.getCurrentPosition(

    (position) => {

      const lat =
        position.coords.latitude;

      const lng =
        position.coords.longitude;


      /*
       * Move map to current location
       */

      map.value.setView(
        [lat, lng],
        16
      );


      /*
       * Use current location as pickup
       */

      setPickup(lat, lng);


      loadingLocation.value = false;
    },


    (error) => {

      console.error(error);

      loadingLocation.value = false;

      errorMessage.value =
        "Could not get your current location. Please allow location access.";
    },

    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}


/* =========================
   REQUEST RIDE
========================= */

async function requestRide() {

  errorMessage.value = "";
  successMessage.value = "";


  /*
   * Validation
   */

  if (!pickup.value || !destination.value) {

    errorMessage.value =
      "Please select both pickup and destination.";

    return;
  }


  requestingRide.value = true;


  try {

    /*
     * Data sent to backend
     */

    const requestData = {

      pickupLatitude:
        pickup.value.lat,

      pickupLongitude:
        pickup.value.lng,

      destinationLatitude:
        destination.value.lat,

      destinationLongitude:
        destination.value.lng
    };


    /*
     * JWT
     *
     * Change "token" if you stored
     * your JWT under another name.
     */

    const token =
      localStorage.getItem("token");


    /*
     * Send request to backend
     */

    const response = await fetch(
      `${API_URL}/core/rides/request`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          ...(token
            ? {
                Authorization:
                  `Bearer ${token}`
              }
            : {})
        },

        body: JSON.stringify(requestData)
      }
    );


    const data = await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Failed to request ride"
      );
    }


    /*
     * Success
     */

    successMessage.value =
      "Ride requested successfully!";


    console.log(
      "Ride request response:",
      data
    );


  } catch (error) {

    console.error(error);

    errorMessage.value =
      error.message ||
      "Something went wrong while requesting the ride.";

  } finally {

    requestingRide.value = false;
  }
}


/* =========================
   RESET
========================= */

function resetRide() {

  pickup.value = null;
  destination.value = null;

  routeDistance.value = null;
  routeDuration.value = null;

  errorMessage.value = "";
  successMessage.value = "";


  /*
   * Remove pickup marker
   */

  if (pickupMarker.value) {

    map.value.removeLayer(
      pickupMarker.value
    );

    pickupMarker.value = null;
  }


  /*
   * Remove destination marker
   */

  if (destinationMarker.value) {

    map.value.removeLayer(
      destinationMarker.value
    );

    destinationMarker.value = null;
  }


  /*
   * Remove route
   */

  if (routeLine.value) {

    map.value.removeLayer(
      routeLine.value
    );

    routeLine.value = null;
  }


  /*
   * Return map to Dhaka
   */

  map.value.setView(
    [DEFAULT_LAT, DEFAULT_LNG],
    DEFAULT_ZOOM
  );
}


/* =========================
   LIFECYCLE
========================= */

onMounted(() => {

  initializeMap();

});


onBeforeUnmount(() => {

  if (map.value) {

    map.value.remove();

    map.value = null;
  }

});

</script>


<style scoped>

* {
  box-sizing: border-box;
}


.ride-request-page {
  min-height: 100vh;

  display: flex;

  background: #f5f6f8;
}


/* =========================
   LEFT PANEL
========================= */

.ride-panel {

  width: 400px;

  padding: 32px;

  background: white;

  box-shadow:
    2px 0 10px rgba(0, 0, 0, 0.08);

  z-index: 10;
}


h1 {

  margin: 0;

  font-size: 28px;

  color: #1f2937;
}


.subtitle {

  margin-top: 8px;

  margin-bottom: 28px;

  color: #6b7280;

  font-size: 14px;
}


/* =========================
   LOCATION BOX
========================= */

.location-box {

  display: flex;

  align-items: center;

  gap: 14px;

  padding: 15px;

  margin-bottom: 12px;

  border: 1px solid #e5e7eb;

  border-radius: 10px;

  background: #fafafa;
}


.location-icon {

  width: 32px;

  height: 32px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  font-weight: bold;

  color: white;
}


.pickup-icon {

  background: #2563eb;
}


.destination-icon {

  background: #dc2626;
}


.location-info {

  display: flex;

  flex-direction: column;

  gap: 4px;

  min-width: 0;
}


.location-label {

  font-size: 12px;

  font-weight: 600;

  color: #6b7280;
}


.location-info span:last-child {

  font-size: 13px;

  color: #374151;

  word-break: break-word;
}


.placeholder {

  color: #9ca3af !important;
}


/* =========================
   INSTRUCTION
========================= */

.instruction {

  margin-top: 20px;

  padding: 14px;

  border-radius: 10px;

  background: #f3f4f6;
}


.instruction strong {

  color: #111827;

  font-size: 14px;
}


.instruction p {

  margin: 5px 0 0;

  color: #6b7280;

  font-size: 13px;

  line-height: 1.5;
}


/* =========================
   ROUTE INFO
========================= */

.route-info {

  display: flex;

  gap: 12px;

  margin-top: 18px;
}


.route-item {

  flex: 1;

  padding: 14px;

  border: 1px solid #e5e7eb;

  border-radius: 10px;

  display: flex;

  flex-direction: column;

  gap: 5px;
}


.route-label {

  font-size: 12px;

  color: #6b7280;
}


.route-item strong {

  font-size: 16px;

  color: #111827;
}


/* =========================
   BUTTONS
========================= */

.button-group {

  display: flex;

  gap: 10px;

  margin-top: 20px;
}


.location-button,
.reset-button,
.request-button {

  border: none;

  border-radius: 8px;

  cursor: pointer;

  font-size: 14px;

  font-weight: 600;

  transition: 0.2s;
}


.location-button {

  flex: 1;

  padding: 12px;

  background: #e5e7eb;

  color: #374151;
}


.location-button:hover {

  background: #d1d5db;
}


.reset-button {

  padding: 12px 18px;

  background: #fee2e2;

  color: #b91c1c;
}


.reset-button:hover {

  background: #fecaca;
}


.request-button {

  width: 100%;

  margin-top: 12px;

  padding: 14px;

  background: #111827;

  color: white;

  font-size: 15px;
}


.request-button:hover:not(:disabled) {

  background: #374151;
}


.request-button:disabled {

  opacity: 0.5;

  cursor: not-allowed;
}


.location-button:disabled {

  opacity: 0.6;

  cursor: not-allowed;
}


/* =========================
   MESSAGES
========================= */

.success-message {

  margin-top: 15px;

  padding: 12px;

  border-radius: 8px;

  background: #dcfce7;

  color: #166534;

  font-size: 13px;
}


.error-message {

  margin-top: 15px;

  padding: 12px;

  border-radius: 8px;

  background: #fee2e2;

  color: #991b1b;

  font-size: 13px;
}


/* =========================
   MAP
========================= */

.map-container {

  position: relative;

  flex: 1;

  min-height: 100vh;
}


#ride-map {

  width: 100%;

  height: 100vh;
}


.map-help {

  position: absolute;

  top: 20px;

  left: 20px;

  z-index: 1000;

  display: flex;

  flex-direction: column;

  gap: 4px;

  padding: 12px 15px;

  background: white;

  border-radius: 8px;

  box-shadow:
    0 2px 10px rgba(0, 0, 0, 0.15);

  font-size: 13px;
}


.map-help strong {

  color: #111827;
}


.map-help span {

  color: #6b7280;
}


/* =========================
   MOBILE
========================= */

@media (max-width: 800px) {

  .ride-request-page {

    flex-direction: column;
  }


  .ride-panel {

    width: 100%;

    padding: 20px;
  }


  .map-container {

    height: 500px;

    min-height: 500px;
  }


  #ride-map {

    height: 500px;
  }

}

</style>
```
