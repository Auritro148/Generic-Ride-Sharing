```vue
<template>
  <div class="status-page">
    <div class="card">
      <h2>Driver Status Test</h2>

      <div class="status">
        <span
          class="dot"
          :class="isOnline ? 'online' : 'offline'"
        ></span>

        <span>
          {{ isOnline ? "ONLINE" : "OFFLINE" }}
        </span>
      </div>

      <div class="info">
        <p>
          <strong>WebSocket:</strong>
          {{ socketStatus }}
        </p>

        <p>
          <strong>Latitude:</strong>
          {{ latitude ?? "Not available" }}
        </p>

        <p>
          <strong>Longitude:</strong>
          {{ longitude ?? "Not available" }}
        </p>
      </div>

      <div class="buttons">
        <button
          @click="goOnline"
          :disabled="isOnline || loading"
        >
          {{ loading ? "Processing..." : "Go Online" }}
        </button>

        <button
          @click="goOffline"
          :disabled="!isOnline || loading"
        >
          {{ loading ? "Processing..." : "Go Offline" }}
        </button>
      </div>

      <p v-if="message" class="message">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const API_BASE_URL = "http://localhost:5000";
const WS_URL = "ws://localhost:5000/core/driver/ws";

const isOnline = ref(false);
const loading = ref(false);

const socketStatus = ref("Disconnected");

const latitude = ref(null);
const longitude = ref(null);

const message = ref("");

let socket = null;


function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
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


async function goOnline() {
  if (isOnline.value) {
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("JWT token not found");
    }

    const location = await getCurrentLocation();

    latitude.value = location.lat;
    longitude.value = location.long;


    const response = await fetch(
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


    const data = await response.json();


    if (!response.ok) {
      throw new Error(
        data.message || "Failed to go online"
      );
    }


    isOnline.value = true;

    message.value = data.message || "Driver is now online";


    connectWebSocket(token);

  } catch (error) {
    console.error("Go online error:", error);

    message.value = error.message || "Failed to go online";
  } finally {
    loading.value = false;
  }
}


// function connectWebSocket(token) {
//   if (socket) {
//     socket.close();
//     socket = null;
//   }


//   socketStatus.value = "Connecting...";


//   socket = new WebSocket(
//     `${WS_URL}?token=${encodeURIComponent(token)}`
//   );


//   socket.onopen = () => {
//     socketStatus.value = "Connected";
//   };


//   socket.onmessage = (event) => {
//     try {
//       const data = JSON.parse(event.data);

//       console.log("WebSocket message:", data);

//       if (data.type === "connection_established") {
//         socketStatus.value = "Connected";
//         message.value = "Driver WebSocket connected";
//       }

//       if (data.type === "pong") {
//         console.log("Pong received");
//       }

//     } catch (error) {
//       console.error(
//         "Invalid WebSocket message:",
//         error
//       );
//     }
//   };


//   socket.onclose = (event) => {
//     console.log(
//       "WebSocket closed:",
//       event.code,
//       event.reason
//     );

//     socketStatus.value = "Disconnected";

//     socket = null;
//   };


//   socket.onerror = (error) => {
//     console.error("WebSocket error:", error);

//     socketStatus.value = "Error";
//   };
// }


function connectWebSocket(token) {

  console.log("Starting WebSocket connection...");
  console.log("Token exists:", !!token);


  const wsUrl =
    `ws://localhost:5000/core/driver/ws?token=${encodeURIComponent(token)}`;


  console.log("WebSocket URL:", wsUrl);


  socket = new WebSocket(wsUrl);


  // -----------------------------------------
  // WebSocket connected
  // -----------------------------------------

  socket.onopen = () => {

    console.log("WEBSOCKET CONNECTED");

    socketStatus.value = "Connected";
  };


  // -----------------------------------------
  // Message received from backend
  // -----------------------------------------

  socket.onmessage = (event) => {

    console.log(
      "WEBSOCKET MESSAGE RECEIVED:",
      event.data
    );


    try {

      const data =
        JSON.parse(event.data);


      console.log(
        "PARSED WEBSOCKET EVENT:",
        data
      );


      // -----------------------------------------
      // Connection established event
      // -----------------------------------------

      if (
        data.type ===
        "connection_established"
      ) {

        console.log(
          "Driver WebSocket connection established:",
          data
        );

        socketStatus.value =
          "Connected";

        message.value =
          "Driver WebSocket connected";
      }


      // -----------------------------------------
      // Ride request event
      // -----------------------------------------

      if (
        data.type ===
        "ride_request"
      ) {

        console.log(
          "================================"
        );

        console.log(
          "NEW RIDE REQUEST RECEIVED"
        );

        console.log(
          "Request ID:",
          data.data.req_id
        );

        console.log(
          "Distance:",
          data.data.distance_meters,
          "meters"
        );

        console.log(
          "Complete ride request event:",
          data
        );

        console.log(
          "================================"
        );
      }


      // -----------------------------------------
      // Pong event
      // -----------------------------------------

      if (
        data.type ===
        "pong"
      ) {

        console.log(
          "Pong received"
        );
      }


    } catch (error) {

      console.error(
        "Message parse error:",
        error
      );

    }

  };


  // -----------------------------------------
  // WebSocket error
  // -----------------------------------------

  socket.onerror = (error) => {

    console.error(
      "WEBSOCKET ERROR:",
      error
    );

    socketStatus.value =
      "Error";
  };


  // -----------------------------------------
  // WebSocket closed
  // -----------------------------------------

  socket.onclose = (event) => {

    console.log(
      "WEBSOCKET CLOSED",
      "code:",
      event.code,
      "reason:",
      event.reason
    );

    socketStatus.value =
      "Disconnected";

  };

}




async function goOffline() {
  if (!isOnline.value) {
    return;
  }

  loading.value = true;
  message.value = "";


  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("JWT token not found");
    }


    const response = await fetch(
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


    const data = await response.json();


    if (!response.ok) {
      throw new Error(
        data.message || "Failed to go offline"
      );
    }


    isOnline.value = false;

    message.value = data.message || "Driver is now offline";


    if (socket) {
      socket.close();
      socket = null;
    }

    socketStatus.value = "Disconnected";

  } catch (error) {
    console.error("Go offline error:", error);

    message.value = error.message || "Failed to go offline";
  } finally {
    loading.value = false;
  }
}
</script>


<style scoped>
.status-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f4f4;
}

.card {
  width: 400px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 25px;
}

.status {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 25px;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.dot.online {
  background: green;
}

.dot.offline {
  background: red;
}

.info {
  margin-bottom: 25px;
}

.info p {
  margin: 8px 0;
}

.buttons {
  display: flex;
  gap: 10px;
}

button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:not(:disabled) {
  background: #222;
  color: white;
}

.message {
  margin-top: 20px;
  text-align: center;
}
</style>
```