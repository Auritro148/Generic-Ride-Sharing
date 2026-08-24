<template>
  <div class="home-page">

    <!-- ================= NAVBAR ================= -->

    <nav class="navbar">

      <!-- Logo -->
      <div class="logo">

        <div class="logo-icon">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <span class="logo-text">
          Rooda
        </span>

      </div>


      <!-- Navigation -->
      <div class="nav-links">

        <a href="#">
          Home
        </a>

        <a href="#">
          About us
        </a>

        <a href="#">
          Why Rooda
        </a>

        <a href="#">
          Blog
        </a>

        <a href="#">
          Vehicles
        </a>

      </div>


      <!-- Profile -->
      <div class="profile-area">

        <button
          class="profile-btn"
          type="button"
          @click="goToProfile"
        >

          <span class="profile-icon">
            {{ userInitial }}
          </span>

          <span>
            Hi, {{ userName }}
          </span>

          <span class="profile-arrow">
            ▾
          </span>

        </button>

      </div>

    </nav>



    <!-- ================= MAIN CONTENT ================= -->

    <main class="main-content">

      <!-- Welcome -->

      <div class="welcome-section">

        <p class="welcome-small">
          Welcome back
        </p>

        <h1>
          Where are you going,
          <span>{{ userName }}</span>?
        </h1>

        <p class="welcome-description">
          Choose your pickup and destination to get an estimated fare.
        </p>

      </div>



      <!-- ================= RIDE CARD ================= -->

      <section class="ride-card">


        <!-- ================= LEFT SIDE ================= -->

        <div class="ride-panel">


          <div class="panel-header">

            <div>

              <h2>
                Plan your ride
              </h2>

              <p>
                Select your pickup and destination
              </p>

            </div>

            <div class="location-status">

              <span
                :class="{
                  active: pickupLocation
                }"
              ></span>

              <span
                :class="{
                  active: dropoffLocation
                }"
              ></span>

            </div>

          </div>



          <!-- ================= PICKUP ================= -->

          <div class="location-group">

            <label>
              Pickup location
            </label>


            <div class="location-input-row">

              <div class="input-icon pickup-icon">
                ●
              </div>


              <div class="search-wrapper">

                <input
                  v-model="pickupQuery"
                  type="text"
                  placeholder="Enter pickup location"
                  autocomplete="off"
                  @input="handlePickupInput"
                  @focus="pickupFocused = true"
                  @keydown.escape="pickupFocused = false"
                />


                <!-- Pickup suggestions -->

                <div
                  v-if="
                    pickupFocused &&
                    pickupSuggestions.length > 0
                  "
                  class="suggestions"
                >

                  <button
                    v-for="place in pickupSuggestions"
                    :key="place.id"
                    type="button"
                    class="suggestion-item"
                    @mousedown.prevent="
                      selectPickupSuggestion(place)
                    "
                  >

                    <span class="suggestion-icon">
                      ⌖
                    </span>

                    <span class="suggestion-text">

                      <strong>
                        {{ place.name }}
                      </strong>

                      <small>
                        {{ place.address }}
                      </small>

                    </span>

                  </button>

                </div>

              </div>


              <button
                type="button"
                class="search-btn"
                :disabled="pickupLoading"
                @click="searchPickup"
              >

                <span v-if="!pickupLoading">
                  Search
                </span>

                <span v-else>
                  ...
                </span>

              </button>

            </div>

          </div>



          <!-- ROUTE CONNECTOR -->

          <div class="route-connector">
            <span></span>
          </div>



          <!-- ================= DROPOFF ================= -->

          <div class="location-group">

            <label>
              Drop-off location
            </label>


            <div class="location-input-row">

              <div class="input-icon dropoff-icon">
                ●
              </div>


              <div class="search-wrapper">

                <input
                  v-model="dropoffQuery"
                  type="text"
                  placeholder="Where do you want to go?"
                  autocomplete="off"
                  @input="handleDropoffInput"
                  @focus="dropoffFocused = true"
                  @keydown.escape="dropoffFocused = false"
                />


                <!-- Dropoff suggestions -->

                <div
                  v-if="
                    dropoffFocused &&
                    dropoffSuggestions.length > 0
                  "
                  class="suggestions"
                >

                  <button
                    v-for="place in dropoffSuggestions"
                    :key="place.id"
                    type="button"
                    class="suggestion-item"
                    @mousedown.prevent="
                      selectDropoffSuggestion(place)
                    "
                  >

                    <span class="suggestion-icon">
                      ⌖
                    </span>

                    <span class="suggestion-text">

                      <strong>
                        {{ place.name }}
                      </strong>

                      <small>
                        {{ place.address }}
                      </small>

                    </span>

                  </button>

                </div>

              </div>


              <button
                type="button"
                class="search-btn"
                :disabled="dropoffLoading"
                @click="searchDropoff"
              >

                <span v-if="!dropoffLoading">
                  Search
                </span>

                <span v-else>
                  ...
                </span>

              </button>

            </div>

          </div>



          <!-- ================= STATUS ================= -->

          <div
            v-if="locationMessage"
            class="location-message"
            :class="{
              error: locationMessageType === 'error',
              success: locationMessageType === 'success'
            }"
          >

            <span>
              {{ locationMessage }}
            </span>

          </div>



          <!-- ================= RIDE DETAILS ================= -->

          <div
            v-if="pickupLocation && dropoffLocation"
            class="ride-details"
          >


            <!-- Distance -->

            <div class="distance-card">

              <div>

                <span class="detail-label">
                  Estimated distance
                </span>

                <strong>
                  {{ distance }} km
                </strong>

              </div>


              <div class="distance-icon">
                →
              </div>

            </div>



            <!-- Vehicle -->

            <div class="vehicle-section">

              <div class="section-title">

                <h3>
                  Choose your vehicle
                </h3>

                <span>
                  Estimated fare
                </span>

              </div>


              <div class="vehicle-list">

                <button
                  v-for="vehicle in vehicles"
                  :key="vehicle.id"
                  type="button"
                  class="vehicle-card"
                  :class="{
                    selected:
                      selectedVehicle === vehicle.id
                  }"
                  @click="
                    selectedVehicle =
                      vehicle.id
                  "
                >

                  <div class="vehicle-left">

                    <div
                      class="vehicle-circle"
                      :class="vehicle.id"
                    >
                      {{ vehicle.icon }}
                    </div>


                    <div class="vehicle-info">

                      <strong>
                        {{ vehicle.name }}
                      </strong>

                      <span>
                        Base ৳{{ vehicle.baseFare }}
                        +
                        ৳{{ vehicle.perKm }}/km
                      </span>

                    </div>

                  </div>


                  <div class="vehicle-price">

                    ৳{{
                      Math.round(
                        vehicle.baseFare +
                        distance * vehicle.perKm
                      )
                    }}

                  </div>

                </button>

              </div>

            </div>



            <!-- ================= COUPON ================= -->

            <div class="coupon-section">

              <h3>
                Have a coupon?
              </h3>


              <div class="coupon-row">

                <input
                  v-model="couponCode"
                  type="text"
                  placeholder="Enter coupon code"
                  @keyup.enter="applyCoupon"
                />

                <button
                  type="button"
                  @click="applyCoupon"
                >
                  Apply
                </button>

              </div>


              <p
                v-if="couponMessage"
                class="coupon-message"
                :class="{
                  success:
                    couponDiscount > 0,
                  error:
                    couponDiscount === 0
                }"
              >
                {{ couponMessage }}
              </p>

            </div>



            <!-- ================= FARE SUMMARY ================= -->

            <div class="fare-summary">

              <div class="fare-line">

                <span>
                  Base fare
                </span>

                <span>
                  ৳{{ baseFare }}
                </span>

              </div>


              <div class="fare-line">

                <span>
                  Distance
                </span>

                <span>
                  {{ distance }} km
                </span>

              </div>


              <div class="fare-line">

                <span>
                  Rate
                </span>

                <span>
                  ৳{{ selectedVehicleData.perKm }}/km
                </span>

              </div>


              <div
                v-if="couponDiscount > 0"
                class="fare-line discount"
              >

                <span>
                  Coupon discount
                </span>

                <span>
                  - ৳{{ couponDiscount }}
                </span>

              </div>


              <div class="fare-total">

                <div>

                  <span>
                    Estimated fare
                  </span>

                  <small>
                    Final fare may vary slightly
                  </small>

                </div>


                <strong>
                  ৳{{ estimatedFare }}
                </strong>

              </div>

            </div>



            <!-- ================= REQUEST ================= -->

            <button
              type="button"
              class="request-btn"
              :disabled="requestLoading"
              @click="requestRide"
            >

              <span>
                {{
                  requestLoading
                    ? 'Requesting...'
                    : 'Request Ride'
                }}
              </span>

              <span class="request-arrow">
                →
              </span>

            </button>

          </div>


          <!-- Empty state -->

          <div
            v-else
            class="ride-hint"
          >

            <div class="hint-icon">
              ✦
            </div>

            <div>

              <strong>
                Choose your route
              </strong>

              <p>
                Enter your pickup and drop-off locations
                or click directly on the map.
              </p>

            </div>

          </div>

        </div>



        <!-- ================= MAP ================= -->

        <div class="map-panel">

          <div
            ref="mapContainer"
            class="map"
          ></div>


          <!-- Map overlay -->

          <div class="map-top-card">

            <span class="map-live-dot"></span>

            <span>
              Dhaka service area
            </span>

          </div>


          <div class="map-instruction">

            <span class="map-click-icon">
              ⌖
            </span>

            <span>
              Click on the map to select a location
            </span>

          </div>


          <!-- Current selection -->

          <div
            v-if="mapSelectionText"
            class="map-selection"
          >

            {{ mapSelectionText }}

          </div>

        </div>

      </section>

    </main>

  </div>
</template>



<script setup>

import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount
} from 'vue'

import {
  useRouter
} from 'vue-router'

import L from 'leaflet'

import 'leaflet/dist/leaflet.css'



/* =====================================================
   ROUTER
===================================================== */

const router = useRouter()



/* =====================================================
   USER
===================================================== */

const userName = ref(
  localStorage.getItem('user_name') ||
  localStorage.getItem('name') ||
  'User'
)


const userInitial = computed(() => {

  return userName.value
    .charAt(0)
    .toUpperCase()

})



/* =====================================================
   MAP
===================================================== */

const mapContainer = ref(null)

let map = null

let pickupMarker = null

let dropoffMarker = null

let routeLine = null



/*
  Approximate Dhaka service area.

  South-West:
  23.65, 90.25

  North-East:
  23.95, 90.55
*/

const DHAKA_BOUNDS = [
  [23.65, 90.25],
  [23.95, 90.55]
]


const DHAKA_CENTER = [
  23.8103,
  90.4125
]



/* =====================================================
   LOCATIONS
===================================================== */

const pickupQuery = ref('')

const dropoffQuery = ref('')


const pickupLocation = ref(null)

const dropoffLocation = ref(null)



/* =====================================================
   SUGGESTIONS
===================================================== */

const pickupSuggestions = ref([])

const dropoffSuggestions = ref([])


const pickupFocused = ref(false)

const dropoffFocused = ref(false)


const pickupLoading = ref(false)

const dropoffLoading = ref(false)



let pickupSearchTimer = null

let dropoffSearchTimer = null



/* =====================================================
   STATUS
===================================================== */

const locationMessage = ref('')

const locationMessageType = ref('success')



/* =====================================================
   VEHICLES
===================================================== */

const vehicles = [
  {
    id: 'bike',
    name: 'Bike',
    icon: '🏍',
    baseFare: 30,
    perKm: 12
  },

  {
    id: 'car',
    name: 'Car',
    icon: '🚗',
    baseFare: 60,
    perKm: 18
  },

  {
    id: 'premium',
    name: 'Premium',
    icon: '◆',
    baseFare: 100,
    perKm: 25
  }
]


const selectedVehicle = ref('car')


const selectedVehicleData = computed(() => {

  return (
    vehicles.find(
      vehicle =>
        vehicle.id ===
        selectedVehicle.value
    ) ||
    vehicles[1]
  )

})



/* =====================================================
   DISTANCE
===================================================== */

const distance = ref(null)



/* =====================================================
   COUPON
===================================================== */

const couponCode = ref('')

const couponDiscount = ref(0)

const couponMessage = ref('')



/* =====================================================
   REQUEST
===================================================== */

const requestLoading = ref(false)



/* =====================================================
   FARE
===================================================== */

const baseFare = computed(() => {

  if (!distance.value) {
    return 0
  }

  return selectedVehicleData
    .value
    .baseFare

})


const estimatedFare = computed(() => {

  if (!distance.value) {
    return 0
  }

  const fare =
    selectedVehicleData
      .value
      .baseFare +

    (
      distance.value *
      selectedVehicleData
        .value
        .perKm
    )


  return Math.max(
    0,
    Math.round(
      fare -
      couponDiscount.value
    )
  )

})



/* =====================================================
   MAP SELECTION TEXT
===================================================== */

const mapSelectionText = computed(() => {

  if (
    pickupLocation.value &&
    dropoffLocation.value
  ) {

    return 'Pickup and drop-off selected'

  }

  if (pickupLocation.value) {

    return 'Pickup selected • Click for drop-off'

  }

  if (dropoffLocation.value) {

    return 'Drop-off selected • Click for pickup'

  }

  return ''

})



/* =====================================================
   INIT MAP
===================================================== */

const initializeMap = () => {

  if (!mapContainer.value) {
    return
  }


  map = L.map(
    mapContainer.value,
    {
      center: DHAKA_CENTER,

      zoom: 12,

      minZoom: 10,

      maxZoom: 18,

      maxBounds:
        DHAKA_BOUNDS,

      maxBoundsViscosity: 1.0,

      zoomControl: true,

      attributionControl: true

    }
  )


  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      maxZoom: 19,

      attribution:
        '&copy; OpenStreetMap contributors'
    }
  ).addTo(map)


  /*
    Click map to select location.
  */

  map.on(
    'click',
    handleMapClick
  )



  /*
    Fix map rendering if card size changes.
  */

  setTimeout(() => {

    if (map) {
      map.invalidateSize()
    }

  }, 300)

}



/* =====================================================
   CHECK DHAKA
===================================================== */

const isInsideDhaka = (
  lat,
  lon
) => {

  const south =
    DHAKA_BOUNDS[0][0]

  const west =
    DHAKA_BOUNDS[0][1]

  const north =
    DHAKA_BOUNDS[1][0]

  const east =
    DHAKA_BOUNDS[1][1]


  return (
    lat >= south &&
    lat <= north &&
    lon >= west &&
    lon <= east
  )

}



/* =====================================================
   CREATE MARKER ICON
===================================================== */

const createMarkerIcon = (
  type
) => {

  const color =
    type === 'pickup'
      ? '#20df4f'
      : '#ff5c5c'


  const label =
    type === 'pickup'
      ? 'P'
      : 'D'


  return L.divIcon({

    className:
      'custom-marker-wrapper',

    html: `
      <div
        style="
          width: 42px;
          height: 42px;
          border-radius: 50% 50% 50% 0;
          background: ${color};
          border: 4px solid white;
          box-shadow: 0 5px 18px rgba(0,0,0,0.35);
          transform: rotate(-45deg);
          display:flex;
          align-items:center;
          justify-content:center;
        "
      >
        <span
          style="
            transform: rotate(45deg);
            color:#111;
            font-weight:800;
            font-size:14px;
          "
        >
          ${label}
        </span>
      </div>
    `,

    iconSize: [
      42,
      42
    ],

    iconAnchor: [
      21,
      42
    ],

    popupAnchor: [
      0,
      -42
    ]

  })

}



/* =====================================================
   MAP CLICK
===================================================== */

const handleMapClick = async (
  event
) => {

  const lat =
    event.latlng.lat

  const lon =
    event.latlng.lng


  if (
    !isInsideDhaka(
      lat,
      lon
    )
  ) {

    showMessage(
      'Please select a location inside Dhaka.',
      'error'
    )

    return

  }


  /*
    If pickup is empty,
    map click becomes pickup.
  */

  if (!pickupLocation.value) {

    await selectLocationFromCoordinates(
      lat,
      lon,
      'pickup'
    )

    return

  }


  /*
    If pickup exists but dropoff
    does not, map click becomes dropoff.
  */

  if (!dropoffLocation.value) {

    await selectLocationFromCoordinates(
      lat,
      lon,
      'dropoff'
    )

    return

  }


  /*
    If both already exist,
    start again with pickup.
  */

  await selectLocationFromCoordinates(
    lat,
    lon,
    'pickup'
  )

}



/* =====================================================
   SEARCH LOCATION USING PHOTON
===================================================== */

const searchPlaces = async (
  query
) => {

  if (
    !query ||
    query.trim().length < 2
  ) {

    return []

  }


  const url =
    'https://photon.komoot.io/api/' +
    '?q=' +
    encodeURIComponent(
      query
    ) +
    '&lat=23.8103' +
    '&lon=90.4125' +
    '&limit=8'


  try {

    const response =
      await fetch(url)


    if (!response.ok) {
      throw new Error(
        'Location search failed'
      )
    }


    const data =
      await response.json()


    return data.features
      .filter(feature => {

        const coordinates =
          feature.geometry
            .coordinates

        const lon =
          coordinates[0]

        const lat =
          coordinates[1]

        return isInsideDhaka(
          lat,
          lon
        )

      })
      .map(feature => {

        const properties =
          feature.properties || {}

        const coordinates =
          feature.geometry
            .coordinates


        const name =
          properties.name ||
          properties.street ||
          'Selected location'


        const addressParts = [
          properties.street,
          properties.district,
          properties.city,
          properties.state
        ].filter(Boolean)


        return {

          id:
            feature.properties.osm_id ||
            `${coordinates[0]}-${coordinates[1]}`,

          name,

          address:
            addressParts
              .filter(
                (item, index) =>
                  addressParts
                    .indexOf(item) === index
              )
              .join(', '),

          lat:
            Number(
              coordinates[1]
            ),

          lon:
            Number(
              coordinates[0]
            )

        }

      })

  } catch (error) {

    console.error(
      'Search error:',
      error
    )

    return []

  }

}



/* =====================================================
   PICKUP INPUT
===================================================== */

const handlePickupInput = () => {

  pickupLocation.value = null

  pickupSuggestions.value = []

  if (
    pickupSearchTimer
  ) {

    clearTimeout(
      pickupSearchTimer
    )

  }


  if (
    pickupQuery.value
      .trim()
      .length < 2
  ) {

    return

  }


  pickupSearchTimer =
    setTimeout(
      async () => {

        pickupLoading.value =
          true


        pickupSuggestions.value =
          await searchPlaces(
            pickupQuery.value
          )


        pickupLoading.value =
          false

      },
      450
    )

}



/* =====================================================
   DROPOFF INPUT
===================================================== */

const handleDropoffInput = () => {

  dropoffLocation.value = null

  dropoffSuggestions.value = []

  if (
    dropoffSearchTimer
  ) {

    clearTimeout(
      dropoffSearchTimer
    )

  }


  if (
    dropoffQuery.value
      .trim()
      .length < 2
  ) {

    return

  }


  dropoffSearchTimer =
    setTimeout(
      async () => {

        dropoffLoading.value =
          true


        dropoffSuggestions.value =
          await searchPlaces(
            dropoffQuery.value
          )


        dropoffLoading.value =
          false

      },
      450
    )

}



/* =====================================================
   SEARCH PICKUP BUTTON
===================================================== */

const searchPickup = async () => {

  if (
    pickupQuery.value
      .trim()
      .length < 2
  ) {

    showMessage(
      'Please enter a pickup location.',
      'error'
    )

    return

  }


  pickupLoading.value = true


  const results =
    await searchPlaces(
      pickupQuery.value
    )


  pickupLoading.value = false


  if (
    results.length === 0
  ) {

    showMessage(
      'No location found inside Dhaka.',
      'error'
    )

    return

  }


  selectPickupSuggestion(
    results[0]
  )

}



/* =====================================================
   SEARCH DROPOFF BUTTON
===================================================== */

const searchDropoff = async () => {

  if (
    dropoffQuery.value
      .trim()
      .length < 2
  ) {

    showMessage(
      'Please enter a drop-off location.',
      'error'
    )

    return

  }


  dropoffLoading.value = true


  const results =
    await searchPlaces(
      dropoffQuery.value
    )


  dropoffLoading.value = false


  if (
    results.length === 0
  ) {

    showMessage(
      'No location found inside Dhaka.',
      'error'
    )

    return

  }


  selectDropoffSuggestion(
    results[0]
  )

}



/* =====================================================
   SELECT PICKUP SUGGESTION
===================================================== */

const selectPickupSuggestion = (
  place
) => {

  pickupLocation.value = {

    name: place.name,

    address: place.address,

    lat: place.lat,

    lon: place.lon

  }


  pickupQuery.value =
    place.name


  pickupSuggestions.value = []

  pickupFocused.value = false


  setPickupMarker(
    place.lat,
    place.lon,
    place.name
  )


  showMessage(
    'Pickup location selected.',
    'success'
  )


  calculateDistance()

}



/* =====================================================
   SELECT DROPOFF SUGGESTION
===================================================== */

const selectDropoffSuggestion = (
  place
) => {

  dropoffLocation.value = {

    name: place.name,

    address: place.address,

    lat: place.lat,

    lon: place.lon

  }


  dropoffQuery.value =
    place.name


  dropoffSuggestions.value = []

  dropoffFocused.value = false


  setDropoffMarker(
    place.lat,
    place.lon,
    place.name
  )


  showMessage(
    'Drop-off location selected.',
    'success'
  )


  calculateDistance()

}



/* =====================================================
   SET PICKUP MARKER
===================================================== */

const setPickupMarker = (
  lat,
  lon,
  name
) => {

  if (!map) {
    return
  }


  if (pickupMarker) {

    map.removeLayer(
      pickupMarker
    )

  }


  pickupMarker =
    L.marker(
      [
        lat,
        lon
      ],
      {
        icon:
          createMarkerIcon(
            'pickup'
          )
      }
    )
      .addTo(map)
      .bindPopup(
        `<strong>Pickup</strong><br>${name}`
      )


  pickupMarker.openPopup()


  map.flyTo(
    [
      lat,
      lon
    ],
    15,
    {
      duration: 0.8
    }
  )


  updateRouteLine()

}



/* =====================================================
   SET DROPOFF MARKER
===================================================== */

const setDropoffMarker = (
  lat,
  lon,
  name
) => {

  if (!map) {
    return
  }


  if (dropoffMarker) {

    map.removeLayer(
      dropoffMarker
    )

  }


  dropoffMarker =
    L.marker(
      [
        lat,
        lon
      ],
      {
        icon:
          createMarkerIcon(
            'dropoff'
          )
      }
    )
      .addTo(map)
      .bindPopup(
        `<strong>Drop-off</strong><br>${name}`
      )


  dropoffMarker.openPopup()


  map.flyTo(
    [
      lat,
      lon
    ],
    15,
    {
      duration: 0.8
    }
  )


  updateRouteLine()

}



/* =====================================================
   REVERSE GEOCODING
===================================================== */

const reverseGeocode = async (
  lat,
  lon
) => {

  try {

    const response =
      await fetch(
        `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`
      )


    if (!response.ok) {

      throw new Error(
        'Reverse geocoding failed'
      )

    }


    const data =
      await response.json()


    const feature =
      data.features?.[0]


    if (!feature) {

      return {
        name:
          `${lat.toFixed(5)}, ${lon.toFixed(5)}`,

        address:
          'Selected location',

        lat,

        lon
      }

    }


    const properties =
      feature.properties || {}


    const addressParts = [
      properties.street,
      properties.district,
      properties.city,
      properties.state
    ].filter(Boolean)


    return {

      name:
        properties.name ||
        properties.street ||
        'Selected location',

      address:
        addressParts.join(', '),

      lat,

      lon

    }

  } catch (error) {

    console.error(
      'Reverse geocode error:',
      error
    )


    return {

      name:
        `${lat.toFixed(5)}, ${lon.toFixed(5)}`,

      address:
        'Selected location',

      lat,

      lon

    }

  }

}



/* =====================================================
   SELECT LOCATION FROM MAP
===================================================== */

const selectLocationFromCoordinates =
  async (
    lat,
    lon,
    type
  ) => {

    const place =
      await reverseGeocode(
        lat,
        lon
      )


    if (
      type === 'pickup'
    ) {

      pickupLocation.value =
        place

      pickupQuery.value =
        place.name


      setPickupMarker(
        lat,
        lon,
        place.name
      )


      showMessage(
        'Pickup selected from map.',
        'success'
      )

    } else {

      dropoffLocation.value =
        place

      dropoffQuery.value =
        place.name


      setDropoffMarker(
        lat,
        lon,
        place.name
      )


      showMessage(
        'Drop-off selected from map.',
        'success'
      )

    }


    calculateDistance()

  }



/* =====================================================
   DISTANCE
===================================================== */

const toRadians = (
  degrees
) => {

  return (
    degrees *
    Math.PI /
    180
  )

}


const calculateDistance = () => {

  if (
    !pickupLocation.value ||
    !dropoffLocation.value
  ) {

    distance.value = null

    return

  }


  const lat1 =
    Number(
      pickupLocation.value.lat
    )

  const lon1 =
    Number(
      pickupLocation.value.lon
    )

  const lat2 =
    Number(
      dropoffLocation.value.lat
    )

  const lon2 =
    Number(
      dropoffLocation.value.lon
    )


  const earthRadius = 6371


  const dLat =
    toRadians(
      lat2 - lat1
    )

  const dLon =
    toRadians(
      lon2 - lon1
    )


  const a =
    Math.sin(
      dLat / 2
    ) ** 2 +

    Math.cos(
      toRadians(lat1)
    ) *

    Math.cos(
      toRadians(lat2)
    ) *

    Math.sin(
      dLon / 2
    ) ** 2


  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )


  distance.value =
    Number(
      (
        earthRadius *
        c
      ).toFixed(2)
    )


  updateRouteLine()

}



/* =====================================================
   ROUTE LINE
===================================================== */

const updateRouteLine = () => {

  if (!map) {
    return
  }


  if (routeLine) {

    map.removeLayer(
      routeLine
    )

    routeLine = null

  }


  if (
    !pickupLocation.value ||
    !dropoffLocation.value
  ) {

    return

  }


  /*
    This is a straight line between
    pickup and dropoff.

    Later we can replace this with
    real road routing.
  */

  routeLine =
    L.polyline(
      [
        [
          pickupLocation.value.lat,
          pickupLocation.value.lon
        ],

        [
          dropoffLocation.value.lat,
          dropoffLocation.value.lon
        ]
      ],
      {
        color:
          '#20df4f',

        weight:
          4,

        opacity:
          0.8,

        dashArray:
          '8 8'
      }
    )
      .addTo(map)


  map.fitBounds(
    routeLine.getBounds(),
    {
      padding:
        [50, 50]
    }
  )

}



/* =====================================================
   COUPON
===================================================== */

const applyCoupon = () => {

  const code =
    couponCode.value
      .trim()
      .toUpperCase()


  if (!code) {

    couponDiscount.value =
      0

    couponMessage.value =
      'Enter a coupon code.'

    return

  }


  /*
    Temporary demo coupons.

    Later these should be
    validated by your backend.
  */

  if (
    code === 'ROODA10'
  ) {

    couponDiscount.value =
      10

    couponMessage.value =
      'Coupon applied — ৳10 off.'

    return

  }


  if (
    code === 'ROODA20'
  ) {

    couponDiscount.value =
      20

    couponMessage.value =
      'Coupon applied — ৳20 off.'

    return

  }


  couponDiscount.value =
    0

  couponMessage.value =
    'Invalid coupon code.'

}



/* =====================================================
   MESSAGE
===================================================== */

let messageTimer = null


const showMessage = (
  message,
  type = 'success'
) => {

  locationMessage.value =
    message

  locationMessageType.value =
    type


  if (messageTimer) {

    clearTimeout(
      messageTimer
    )

  }


  messageTimer =
    setTimeout(
      () => {

        locationMessage.value =
          ''

      },
      3500
    )

}



/* =====================================================
   REQUEST RIDE
===================================================== */

const requestRide = async () => {

  if (
    !pickupLocation.value ||
    !dropoffLocation.value
  ) {

    showMessage(
      'Please select pickup and drop-off locations.',
      'error'
    )

    return

  }


  if (!distance.value) {

    showMessage(
      'Unable to calculate distance.',
      'error'
    )

    return

  }


  requestLoading.value =
    true


  try {

    /*
      This is the payload we will
      eventually send to:

      POST /core/rides/request
    */

    const rideData = {

      pickup: {

        name:
          pickupLocation.value.name,

        address:
          pickupLocation.value.address,

        latitude:
          pickupLocation.value.lat,

        longitude:
          pickupLocation.value.lon

      },

      dropoff: {

        name:
          dropoffLocation.value.name,

        address:
          dropoffLocation.value.address,

        latitude:
          dropoffLocation.value.lat,

        longitude:
          dropoffLocation.value.lon

      },

      distance:
        distance.value,

      vehicleType:
        selectedVehicle.value,

      estimatedFare:
        estimatedFare.value,

      coupon:
        couponCode.value || null,

      couponDiscount:
        couponDiscount.value

    }


    console.log(
      'Ride request:',
      rideData
    )


    /*
      IMPORTANT:

      Your backend endpoint is:

      POST /core/rides/request

      When your backend is ready,
      uncomment/adapt the API call.

      Example:

      const token =
        localStorage.getItem('token')

      const response =
        await fetch(
          'http://localhost:5000/core/rides/request',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
              Authorization:
                `Bearer ${token}`
            },
            body:
              JSON.stringify(rideData)
          }
        )

      if (!response.ok) {
        throw new Error(
          'Ride request failed'
        )
      }
    */


    alert(
      `Ride ready!\n\n` +
      `Vehicle: ${selectedVehicleData.value.name}\n` +
      `Distance: ${distance.value} km\n` +
      `Estimated fare: ৳${estimatedFare.value}`
    )

  } catch (error) {

    console.error(
      'Request ride error:',
      error
    )

    showMessage(
      'Unable to request ride.',
      'error'
    )

  } finally {

    requestLoading.value =
      false

  }

}



/* =====================================================
   PROFILE
===================================================== */

const goToProfile = () => {

  router.push(
    '/profile'
  )

}



/* =====================================================
   CLOSE SUGGESTIONS
===================================================== */

const handleDocumentClick = (
  event
) => {

  const target =
    event.target


  if (
    !target.closest(
      '.search-wrapper'
    )
  ) {

    pickupFocused.value =
      false

    dropoffFocused.value =
      false

  }

}



/* =====================================================
   LIFECYCLE
===================================================== */

onMounted(() => {

  initializeMap()

  document.addEventListener(
    'click',
    handleDocumentClick
  )

})


onBeforeUnmount(() => {

  if (map) {

    map.remove()

    map = null

  }


  if (
    pickupSearchTimer
  ) {

    clearTimeout(
      pickupSearchTimer
    )

  }


  if (
    dropoffSearchTimer
  ) {

    clearTimeout(
      dropoffSearchTimer
    )

  }


  if (messageTimer) {

    clearTimeout(
      messageTimer
    )

  }


  document.removeEventListener(
    'click',
    handleDocumentClick
  )

})

</script>



<style scoped>

/* =====================================================
   RESET
===================================================== */

:global(*) {
  box-sizing: border-box;
}

:global(html),
:global(body),
:global(#app) {

  margin: 0;

  padding: 0;

  width: 100%;

  min-height: 100%;

  overflow-x: hidden;

}



/* =====================================================
   PAGE
===================================================== */

.home-page {

  width: 100%;

  min-height: 100vh;

  color: white;

  background:
    radial-gradient(
      circle at 75% 25%,
      rgba(32, 223, 79, 0.08),
      transparent 28%
    ),
    #0b0d0c;

}



/* =====================================================
   NAVBAR
===================================================== */

.navbar {

  width: 100%;

  height: 88px;

  padding:
    0 5.5%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  border-bottom:
    1px solid
    rgba(255,255,255,0.06);

  background:
    rgba(11,13,12,0.88);

  backdrop-filter:
    blur(18px);

  position:
    sticky;

  top: 0;

  z-index: 1000;

}



/* =====================================================
   LOGO
===================================================== */

.logo {

  display: flex;

  align-items: center;

  gap: 10px;

}

.logo-text {

  font-size: 32px;

  font-weight: 700;

  letter-spacing: -1.5px;

}


.logo-icon {

  width: 34px;

  height: 34px;

  display: grid;

  grid-template-columns:
    15px 15px;

  grid-template-rows:
    15px 15px;

  gap: 4px;

}


.logo-icon span {

  width: 15px;

  height: 15px;

  background:
    #20df4f;

  border-radius:
    50%;

}

.logo-icon span:nth-child(2) {

  border-radius:
    50% 50% 50% 0;

}

.logo-icon span:nth-child(3) {

  border-radius:
    50% 0 50% 50%;

}

.logo-icon span:nth-child(4) {

  border-radius:
    0 50% 50% 50%;

}



/* =====================================================
   NAV LINKS
===================================================== */

.nav-links {

  display: flex;

  align-items: center;

  gap: 34px;

}

.nav-links a {

  color:
    rgba(255,255,255,0.68);

  text-decoration: none;

  font-size: 14px;

  transition:
    0.2s ease;

}

.nav-links a:hover {

  color:
    #20df4f;

}



/* =====================================================
   PROFILE
===================================================== */

.profile-btn {

  display: flex;

  align-items: center;

  gap: 9px;

  padding:
    6px 12px 6px 6px;

  border:
    1px solid
    rgba(255,255,255,0.1);

  border-radius:
    30px;

  background:
    rgba(255,255,255,0.04);

  color: white;

  cursor: pointer;

  font-size: 13px;

  transition:
    0.2s ease;

}

.profile-btn:hover {

  border-color:
    rgba(32,223,79,0.45);

  background:
    rgba(32,223,79,0.07);

}

.profile-icon {

  width: 32px;

  height: 32px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius:
    50%;

  background:
    #20df4f;

  color:
    #111;

  font-weight: 800;

}

.profile-arrow {

  color:
    rgba(255,255,255,0.45);

}



/* =====================================================
   MAIN
===================================================== */

.main-content {

  width: 100%;

  max-width: 1450px;

  margin:
    0 auto;

  padding:
    55px 5.5% 70px;

}



/* =====================================================
   WELCOME
===================================================== */

.welcome-section {

  margin-bottom:
    28px;

}

.welcome-small {

  margin:
    0 0 8px;

  color:
    #20df4f;

  font-size:
    13px;

  font-weight:
    600;

  text-transform:
    uppercase;

  letter-spacing:
    1.5px;

}

.welcome-section h1 {

  margin:
    0;

  font-size:
    clamp(32px, 4vw, 52px);

  line-height:
    1.1;

  letter-spacing:
    -2px;

  font-weight:
    600;

}

.welcome-section h1 span {

  color:
    #20df4f;

}

.welcome-description {

  margin:
    12px 0 0;

  color:
    rgba(255,255,255,0.48);

  font-size:
    14px;

}



/* =====================================================
   RIDE CARD
===================================================== */

.ride-card {

  display:
    grid;

  grid-template-columns:
    minmax(400px, 0.82fr)
    minmax(500px, 1.18fr);

  min-height:
    650px;

  border:
    1px solid
    rgba(255,255,255,0.08);

  border-radius:
    26px;

  overflow:
    hidden;

  background:
    rgba(18,20,19,0.9);

  box-shadow:
    0 25px 80px
    rgba(0,0,0,0.28);

}



/* =====================================================
   LEFT PANEL
===================================================== */

.ride-panel {

  padding:
    32px;

  overflow:
    visible;

  background:
    rgba(15,17,16,0.96);

}



/* =====================================================
   PANEL HEADER
===================================================== */

.panel-header {

  display:
    flex;

  justify-content:
    space-between;

  align-items:
    flex-start;

  margin-bottom:
    28px;

}

.panel-header h2 {

  margin:
    0 0 5px;

  font-size:
    23px;

  font-weight:
    600;

}

.panel-header p {

  margin:
    0;

  color:
    rgba(255,255,255,0.42);

  font-size:
    12px;

}


.location-status {

  display:
    flex;

  gap:
    5px;

}

.location-status span {

  width:
    8px;

  height:
    8px;

  border-radius:
    50%;

  background:
    rgba(255,255,255,0.15);

}

.location-status span.active {

  background:
    #20df4f;

  box-shadow:
    0 0 10px
    rgba(32,223,79,0.5);

}



/* =====================================================
   LOCATION GROUP
===================================================== */

.location-group {

  position:
    relative;

}

.location-group label {

  display:
    block;

  margin:
    0 0 8px;

  color:
    rgba(255,255,255,0.7);

  font-size:
    12px;

  font-weight:
    600;

}



/* =====================================================
   INPUT ROW
===================================================== */

.location-input-row {

  display:
    flex;

  align-items:
    center;

  gap:
    8px;

  width:
    100%;

}

.input-icon {

  flex:
    0 0 34px;

  width:
    34px;

  height:
    34px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    50%;

  font-size:
    13px;

}

.pickup-icon {

  color:
    #20df4f;

  background:
    rgba(32,223,79,0.1);

}

.dropoff-icon {

  color:
    #ff6b6b;

  background:
    rgba(255,107,107,0.1);

}



.search-wrapper {

  position:
    relative;

  flex:
    1;

  min-width:
    0;

}


.search-wrapper input {

  width:
    100%;

  height:
    50px;

  padding:
    0 15px;

  border:
    1px solid
    rgba(255,255,255,0.1);

  border-radius:
    11px;

  outline:
    none;

  background:
    rgba(255,255,255,0.045);

  color:
    white;

  font-size:
    13px;

  transition:
    0.2s ease;

}

.search-wrapper input:focus {

  border-color:
    rgba(32,223,79,0.6);

  background:
    rgba(255,255,255,0.06);

  box-shadow:
    0 0 0 3px
    rgba(32,223,79,0.06);

}

.search-wrapper input::placeholder {

  color:
    rgba(255,255,255,0.3);

}



/* =====================================================
   SEARCH BUTTON
===================================================== */

.search-btn {

  flex:
    0 0 68px;

  height:
    50px;

  border:
    none;

  border-radius:
    11px;

  background:
    rgba(32,223,79,0.12);

  color:
    #20df4f;

  font-size:
    11px;

  font-weight:
    700;

  cursor:
    pointer;

  transition:
    0.2s ease;

}

.search-btn:hover:not(:disabled) {

  background:
    #20df4f;

  color:
    #111;

}

.search-btn:disabled {

  opacity:
    0.5;

  cursor:
    not-allowed;

}



/* =====================================================
   SUGGESTIONS
===================================================== */

.suggestions {

  position:
    absolute;

  left:
    0;

  right:
    0;

  top:
    calc(100% + 6px);

  z-index:
    100;

  overflow:
    hidden;

  border:
    1px solid
    rgba(255,255,255,0.1);

  border-radius:
    13px;

  background:
    #191c1a;

  box-shadow:
    0 18px 45px
    rgba(0,0,0,0.45);

}


.suggestion-item {

  width:
    100%;

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

  padding:
    12px;

  border:
    none;

  border-bottom:
    1px solid
    rgba(255,255,255,0.05);

  background:
    transparent;

  color:
    white;

  text-align:
    left;

  cursor:
    pointer;

  transition:
    0.15s ease;

}

.suggestion-item:last-child {

  border-bottom:
    none;

}

.suggestion-item:hover {

  background:
    rgba(32,223,79,0.08);

}


.suggestion-icon {

  width:
    30px;

  height:
    30px;

  flex:
    0 0 30px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    50%;

  background:
    rgba(32,223,79,0.1);

  color:
    #20df4f;

}


.suggestion-text {

  min-width:
    0;

}

.suggestion-text strong {

  display:
    block;

  overflow:
    hidden;

  white-space:
    nowrap;

  text-overflow:
    ellipsis;

  font-size:
    12px;

}

.suggestion-text small {

  display:
    block;

  margin-top:
    3px;

  overflow:
    hidden;

  white-space:
    nowrap;

  text-overflow:
    ellipsis;

  color:
    rgba(255,255,255,0.35);

  font-size:
    10px;

}



/* =====================================================
   CONNECTOR
===================================================== */

.route-connector {

  height:
    23px;

  margin-left:
    17px;

  border-left:
    1px dashed
    rgba(255,255,255,0.2);

}



/* =====================================================
   MESSAGE
===================================================== */

.location-message {

  margin-top:
    14px;

  padding:
    10px 13px;

  border-radius:
    10px;

  font-size:
    11px;

}

.location-message.success {

  background:
    rgba(32,223,79,0.08);

  color:
    #20df4f;

  border:
    1px solid
    rgba(32,223,79,0.1);

}

.location-message.error {

  background:
    rgba(255,92,92,0.08);

  color:
    #ff7676;

  border:
    1px solid
    rgba(255,92,92,0.1);

}



/* =====================================================
   RIDE HINT
===================================================== */

.ride-hint {

  display:
    flex;

  gap:
    12px;

  align-items:
    center;

  margin-top:
    28px;

  padding:
    17px;

  border:
    1px solid
    rgba(255,255,255,0.06);

  border-radius:
    13px;

  background:
    rgba(255,255,255,0.025);

}

.hint-icon {

  width:
    35px;

  height:
    35px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  flex:
    0 0 35px;

  border-radius:
    50%;

  background:
    rgba(32,223,79,0.1);

  color:
    #20df4f;

}

.ride-hint strong {

  font-size:
    12px;

}

.ride-hint p {

  margin:
    4px 0 0;

  color:
    rgba(255,255,255,0.35);

  font-size:
    10px;

  line-height:
    1.5;

}



/* =====================================================
   RIDE DETAILS
===================================================== */

.ride-details {

  margin-top:
    25px;

  padding-top:
    24px;

  border-top:
    1px solid
    rgba(255,255,255,0.07);

}



/* =====================================================
   DISTANCE
===================================================== */

.distance-card {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  padding:
    14px 16px;

  border:
    1px solid
    rgba(32,223,79,0.12);

  border-radius:
    13px;

  background:
    rgba(32,223,79,0.05);

}


.detail-label {

  display:
    block;

  margin-bottom:
    4px;

  color:
    rgba(255,255,255,0.4);

  font-size:
    10px;

}

.distance-card strong {

  font-size:
    20px;

}

.distance-icon {

  width:
    36px;

  height:
    36px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    50%;

  background:
    #20df4f;

  color:
    #111;

  font-size:
    19px;

}



/* =====================================================
   VEHICLES
===================================================== */

.vehicle-section {

  margin-top:
    22px;

}


.section-title {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  margin-bottom:
    10px;

}

.section-title h3 {

  margin:
    0;

  font-size:
    13px;

  font-weight:
    600;

}

.section-title span {

  color:
    rgba(255,255,255,0.3);

  font-size:
    10px;

}


.vehicle-list {

  display:
    flex;

  flex-direction:
    column;

  gap:
    7px;

}


.vehicle-card {

  width:
    100%;

  padding:
    10px 12px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  border:
    1px solid
    rgba(255,255,255,0.07);

  border-radius:
    11px;

  background:
    rgba(255,255,255,0.025);

  color:
    white;

  text-align:
    left;

  cursor:
    pointer;

  transition:
    0.18s ease;

}


.vehicle-card:hover {

  border-color:
    rgba(32,223,79,0.3);

}


.vehicle-card.selected {

  border-color:
    #20df4f;

  background:
    rgba(32,223,79,0.07);

}


.vehicle-left {

  display:
    flex;

  align-items:
    center;

  gap:
    10px;

}


.vehicle-circle {

  width:
    34px;

  height:
    34px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    50%;

  background:
    rgba(255,255,255,0.06);

  font-size:
    15px;

}


.vehicle-info strong {

  display:
    block;

  font-size:
    12px;

}

.vehicle-info span {

  display:
    block;

  margin-top:
    3px;

  color:
    rgba(255,255,255,0.35);

  font-size:
    9px;

}


.vehicle-price {

  color:
    #20df4f;

  font-size:
    15px;

  font-weight:
    700;

}



/* =====================================================
   COUPON
===================================================== */

.coupon-section {

  margin-top:
    22px;

}

.coupon-section h3 {

  margin:
    0 0 9px;

  font-size:
    13px;

  font-weight:
    600;

}


.coupon-row {

  display:
    flex;

  gap:
    7px;

}


.coupon-row input {

  flex:
    1;

  min-width:
    0;

  height:
    43px;

  padding:
    0 12px;

  border:
    1px solid
    rgba(255,255,255,0.08);

  border-radius:
    9px;

  outline:
    none;

  background:
    rgba(255,255,255,0.04);

  color:
    white;

  font-size:
    11px;

}


.coupon-row input:focus {

  border-color:
    rgba(32,223,79,0.5);

}


.coupon-row button {

  padding:
    0 15px;

  border:
    none;

  border-radius:
    9px;

  background:
    rgba(32,223,79,0.12);

  color:
    #20df4f;

  font-size:
    11px;

  font-weight:
    700;

  cursor:
    pointer;

}

.coupon-row button:hover {

  background:
    #20df4f;

  color:
    #111;

}


.coupon-message {

  margin:
    6px 0 0;

  font-size:
    10px;

}

.coupon-message.success {

  color:
    #20df4f;

}

.coupon-message.error {

  color:
    #ff7676;

}



/* =====================================================
   FARE
===================================================== */

.fare-summary {

  margin-top:
    22px;

  padding-top:
    16px;

  border-top:
    1px solid
    rgba(255,255,255,0.07);

}


.fare-line {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  margin-bottom:
    7px;

  color:
    rgba(255,255,255,0.43);

  font-size:
    10px;

}


.fare-line span:last-child {

  color:
    rgba(255,255,255,0.65);

}


.fare-line.discount {

  color:
    #20df4f;

}


.fare-line.discount span:last-child {

  color:
    #20df4f;

}


.fare-total {

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  margin-top:
    13px;

  padding-top:
    13px;

  border-top:
    1px solid
    rgba(255,255,255,0.08);

}


.fare-total span {

  display:
    block;

  color:
    rgba(255,255,255,0.72);

  font-size:
    12px;

  font-weight:
    600;

}


.fare-total small {

  display:
    block;

  margin-top:
    3px;

  color:
    rgba(255,255,255,0.28);

  font-size:
    8px;

}


.fare-total strong {

  color:
    #20df4f;

  font-size:
    24px;

}



/* =====================================================
   REQUEST BUTTON
===================================================== */

.request-btn {

  width:
    100%;

  height:
    57px;

  margin-top:
    18px;

  padding:
    5px 7px 5px 20px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    space-between;

  border:
    none;

  border-radius:
    30px;

  background:
    #20df4f;

  color:
    #111;

  font-size:
    14px;

  font-weight:
    800;

  cursor:
    pointer;

  transition:
    0.25s ease;

}


.request-btn:hover:not(:disabled) {

  transform:
    translateY(-2px);

  box-shadow:
    0 10px 30px
    rgba(32,223,79,0.2);

}


.request-btn:disabled {

  opacity:
    0.55;

  cursor:
    not-allowed;

}


.request-arrow {

  width:
    45px;

  height:
    45px;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  border-radius:
    50%;

  background:
    #111;

  color:
    white;

  font-size:
    22px;

}



/* =====================================================
   MAP
===================================================== */

.map-panel {

  position:
    relative;

  min-height:
    650px;

  background:
    #101311;

}


.map {

  width:
    100%;

  height:
    100%;

  min-height:
    650px;

}


/* Darken map slightly */

.map-panel :deep(.leaflet-tile) {

  filter:
    brightness(0.72)
    contrast(1.05)
    saturate(0.75);

}


.map-panel :deep(.leaflet-control-zoom) {

  border:
    none;

}


.map-panel :deep(.leaflet-control-zoom a) {

  background:
    #171a18;

  color:
    white;

  border-color:
    rgba(255,255,255,0.1);

}


.map-panel :deep(.leaflet-control-zoom a:hover) {

  background:
    #20df4f;

  color:
    #111;

}



/* =====================================================
   MAP TOP CARD
===================================================== */

.map-top-card {

  position:
    absolute;

  top:
    18px;

  left:
    18px;

  z-index:
    500;

  display:
    flex;

  align-items:
    center;

  gap:
    8px;

  padding:
    9px 12px;

  border:
    1px solid
    rgba(255,255,255,0.1);

  border-radius:
    20px;

  background:
    rgba(12,14,13,0.84);

  backdrop-filter:
    blur(10px);

  color:
    rgba(255,255,255,0.75);

  font-size:
    10px;

}


.map-live-dot {

  width:
    7px;

  height:
    7px;

  border-radius:
    50%;

  background:
    #20df4f;

  box-shadow:
    0 0 9px
    #20df4f;

}



/* =====================================================
   MAP INSTRUCTION
===================================================== */

.map-instruction {

  position:
    absolute;

  bottom:
    20px;

  left:
    50%;

  transform:
    translateX(-50%);

  z-index:
    500;

  display:
    flex;

  align-items:
    center;

  gap:
    8px;

  width:
    max-content;

  max-width:
    calc(100% - 30px);

  padding:
    10px 14px;

  border:
    1px solid
    rgba(255,255,255,0.1);

  border-radius:
    20px;

  background:
    rgba(12,14,13,0.85);

  backdrop-filter:
    blur(10px);

  color:
    rgba(255,255,255,0.65);

  font-size:
    10px;

}


.map-click-icon {

  color:
    #20df4f;

  font-size:
    14px;

}



/* =====================================================
   MAP SELECTION
===================================================== */

.map-selection {

  position:
    absolute;

  top:
    60px;

  left:
    18px;

  z-index:
    500;

  padding:
    8px 11px;

  border-radius:
    10px;

  background:
    rgba(12,14,13,0.82);

  color:
    #20df4f;

  font-size:
    9px;

}



/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 1000px) {

  .ride-card {

    grid-template-columns:
      1fr;

  }


  .map-panel {

    min-height:
      480px;

    order:
      -1;

  }


  .map {

    min-height:
      480px;

  }


  .nav-links {

    display:
      none;

  }

}


@media (max-width: 600px) {

  .navbar {

    height:
      75px;

    padding:
      0 20px;

  }


  .logo-text {

    font-size:
      27px;

  }


  .profile-btn {

    font-size:
      11px;

  }


  .profile-icon {

    width:
      28px;

    height:
      28px;

  }


  .main-content {

    padding:
      30px 15px 50px;

  }


  .welcome-section h1 {

    font-size:
      34px;

  }


  .ride-panel {

    padding:
      22px 17px;

  }


  .location-input-row {

    gap:
      6px;

  }


  .input-icon {

    display:
      none;

  }


  .search-btn {

    flex:
      0 0 60px;

  }


  .map-panel {

    min-height:
      400px;

  }


  .map {

    min-height:
      400px;

  }


  .map-instruction {

    font-size:
      9px;

  }

}

</style>