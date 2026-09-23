```vue
<template>
  <div class="home-page">

    <nav class="navbar">
      <div class="logo">
        <div class="logo-mark">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="logo-text">Rooda</span>
      </div>

      <div class="nav-links">
        <a href="#">Home</a>
        <a href="#">About us</a>
        <a href="#">Why Rooda</a>
        <a href="#">Blog</a>
        <a href="#">Vehicles</a>
      </div>

      <div class="profile-area">
        <button
          class="profile-button"
          type="button"
          @click.stop="profileOpen = !profileOpen"
        >
          <span class="profile-avatar">
            {{ userInitial }}
          </span>

          <span class="profile-name">
            {{ userName }}
          </span>

          <span class="profile-arrow">
            ▾
          </span>
        </button>

        <div
          v-if="profileOpen"
          class="profile-menu"
        >
          <button
            type="button"
            @click="goToProfile"
          >
            View profile
          </button>

          <button
            type="button"
            @click="signOut"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>


    <main class="page-content">

      <section class="welcome">
        <p class="eyebrow">
          Rooda ride
        </p>

        <h1>
          Where are you going,
          <span>{{ userName }}</span>?
        </h1>

        <p>
          Enter your pickup and destination to get
          an estimated fare.
        </p>
      </section>


      <section class="ride-layout">

        <div class="ride-panel">

          <div class="panel-title">
            <div>
              <h2>Plan your ride</h2>
              <p>
                Choose your pickup and destination
              </p>
            </div>

            <div class="progress">
              <span
                :class="{ active: pickupLocation }"
              ></span>

              <span
                :class="{ active: dropoffLocation }"
              ></span>
            </div>
          </div>


          <!-- PICKUP -->

          <div
            v-if="step === 'pickup'"
            class="location-section"
          >
            <div class="section-label">
              <span class="green-dot"></span>
              Pickup location
            </div>

            <div class="search-box">

              <input
                v-model="pickupQuery"
                type="text"
                autocomplete="off"
                placeholder="Search pickup location"
                @input="onPickupInput"
                @focus="pickupFocused = true"
                @keydown.escape="pickupFocused = false"
              />

              <button
                v-if="pickupQuery"
                class="clear-button"
                type="button"
                @click="clearPickup"
              >
                ×
              </button>
            </div>


            <div
              v-if="
                pickupFocused &&
                (pickupLoading ||
                pickupSuggestions.length)
              "
              class="suggestions"
            >

              <div
                v-if="pickupLoading"
                class="loading-suggestion"
              >
                Searching locations...
              </div>

              <button
                v-for="place in pickupSuggestions"
                :key="place.id"
                type="button"
                class="suggestion"
                @mousedown.prevent="
                  chooseSearchResult(place, 'pickup')
                "
              >
                <span class="suggestion-icon">
                  ⌖
                </span>

                <span class="suggestion-content">
                  <strong>
                    {{ place.name }}
                  </strong>

                  <small>
                    {{ place.address }}
                  </small>
                </span>
              </button>

            </div>


            <button
              class="current-location"
              type="button"
              :disabled="locationLoading"
              @click="useCurrentLocation('pickup')"
            >
              <span>◎</span>

              {{
                locationLoading &&
                currentLocationTarget === 'pickup'
                  ? 'Locating...'
                  : 'Use current location'
              }}
            </button>


            <button
              class="map-select-button"
              type="button"
              @click="startMapSelection('pickup')"
            >
              <span>⌖</span>
              Select pickup on map
            </button>


            <div
              v-if="pendingLocation"
              class="selected-preview"
            >
              <div class="preview-title">
                Selected location
              </div>

              <strong>
                {{ pendingLocation.name }}
              </strong>

              <small>
                {{ pendingLocation.address }}
              </small>

              <div class="preview-actions">
                <button
                  type="button"
                  @click="confirmPendingLocation"
                >
                  Confirm pickup
                </button>

                <button
                  type="button"
                  @click="cancelPendingLocation"
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>


          <!-- DROPOFF -->

          <div
            v-if="step === 'dropoff'"
            class="location-section"
          >

            <div class="section-label">
              <span class="red-dot"></span>
              Where are you going?
            </div>

            <div class="search-box">

              <input
                v-model="dropoffQuery"
                type="text"
                autocomplete="off"
                placeholder="Search destination"
                @input="onDropoffInput"
                @focus="dropoffFocused = true"
                @keydown.escape="dropoffFocused = false"
              />

              <button
                v-if="dropoffQuery"
                class="clear-button"
                type="button"
                @click="clearDropoff"
              >
                ×
              </button>
            </div>


            <div
              v-if="
                dropoffFocused &&
                (dropoffLoading ||
                dropoffSuggestions.length)
              "
              class="suggestions"
            >

              <div
                v-if="dropoffLoading"
                class="loading-suggestion"
              >
                Searching locations...
              </div>

              <button
                v-for="place in dropoffSuggestions"
                :key="place.id"
                type="button"
                class="suggestion"
                @mousedown.prevent="
                  chooseSearchResult(place, 'dropoff')
                "
              >
                <span class="suggestion-icon">
                  ⌖
                </span>

                <span class="suggestion-content">
                  <strong>
                    {{ place.name }}
                  </strong>

                  <small>
                    {{ place.address }}
                  </small>
                </span>
              </button>

            </div>


            <button
              class="current-location"
              type="button"
              :disabled="locationLoading"
              @click="useCurrentLocation('dropoff')"
            >
              <span>◎</span>

              {{
                locationLoading &&
                currentLocationTarget === 'dropoff'
                  ? 'Locating...'
                  : 'Use current location'
              }}
            </button>


            <button
              class="map-select-button"
              type="button"
              @click="startMapSelection('dropoff')"
            >
              <span>⌖</span>
              Select destination on map
            </button>


            <div
              v-if="pendingLocation"
              class="selected-preview"
            >
              <div class="preview-title">
                Selected location
              </div>

              <strong>
                {{ pendingLocation.name }}
              </strong>

              <small>
                {{ pendingLocation.address }}
              </small>

              <div class="preview-actions">
                <button
                  type="button"
                  @click="confirmPendingLocation"
                >
                  Confirm destination
                </button>

                <button
                  type="button"
                  @click="cancelPendingLocation"
                >
                  Cancel
                </button>
              </div>
            </div>

          </div>


          <!-- ROUTE SUMMARY -->

          <div
            v-if="pickupLocation && dropoffLocation"
            class="route-summary"
          >

            <div class="route-location">
              <span class="route-dot pickup"></span>

              <div>
                <small>Pickup</small>
                <strong>
                  {{ pickupLocation.name }}
                </strong>
              </div>
            </div>

            <div class="route-line"></div>

            <div class="route-location">
              <span class="route-dot dropoff"></span>

              <div>
                <small>Destination</small>
                <strong>
                  {{ dropoffLocation.name }}
                </strong>
              </div>
            </div>

            <button
              type="button"
              class="change-route"
              @click="changeLocations"
            >
              Change
            </button>

          </div>


          <!-- DISTANCE -->

          <div
            v-if="
              pickupLocation &&
              dropoffLocation &&
              distance !== null
            "
            class="distance-card"
          >
            <div>
              <small>Road distance</small>
              <strong>
                {{ distance }} km
              </strong>
            </div>

            <div>
              <small>Estimated time</small>
              <strong>
                {{ duration }} min
              </strong>
            </div>
          </div>


          <!-- VEHICLES -->

          <div
            v-if="
              pickupLocation &&
              dropoffLocation
            "
            class="vehicle-section"
          >

            <div class="section-heading">
              <h3>Choose your vehicle</h3>

              <span v-if="fareLoading">
                Calculating...
              </span>
            </div>


            <div
              v-if="vehiclesLoading"
              class="empty-box"
            >
              Loading vehicle types...
            </div>


            <div
              v-else-if="vehicles.length === 0"
              class="empty-box error"
            >
              No vehicle type available.
            </div>


            <div
              v-else
              class="vehicle-list"
            >

              <button
                v-for="vehicle in vehicles"
                :key="vehicle.type"
                type="button"
                class="vehicle-card"
                :class="{
                  selected:
                    selectedVehicle === vehicle.type
                }"
                @click="
                  selectedVehicle = vehicle.type
                "
              >

                <div class="vehicle-main">

                  <div class="vehicle-icon">
                    {{ vehicle.icon || '🚗' }}
                  </div>

                  <div>
                    <strong>
                      {{
                        vehicle.name ||
                        vehicle.type
                      }}
                    </strong>

                    <small>
                      {{
                        vehicle.description ||
                        'Available vehicle'
                      }}
                    </small>
                  </div>

                </div>


                <div class="vehicle-fare">

                  <span
                    v-if="
                      fareFor(vehicle.type) !== null
                    "
                  >
                    ৳{{ fareFor(vehicle.type) }}
                  </span>

                  <span v-else>
                    —
                  </span>

                </div>

              </button>

            </div>

          </div>


          <!-- COUPON -->

          <div
            v-if="
              pickupLocation &&
              dropoffLocation &&
              selectedVehicle
            "
            class="coupon-section"
          >

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
                :disabled="fareLoading"
                @click="applyCoupon"
              >
                Apply
              </button>

            </div>

            <p
              v-if="couponMessage"
              :class="couponMessageType"
            >
              {{ couponMessage }}
            </p>

          </div>


          <!-- FARE -->

          <div
            v-if="selectedFare"
            class="fare-card"
          >

            <div class="fare-row">
              <span>Vehicle</span>
              <strong>
                {{
                  selectedVehicleData?.name ||
                  selectedVehicle
                }}
              </strong>
            </div>

            <div class="fare-row">
              <span>Distance</span>
              <strong>
                {{ distance }} km
              </strong>
            </div>

            <div
              v-if="selectedFare.baseFare !== null"
              class="fare-row"
            >
              <span>Base fare</span>
              <strong>
                ৳{{ selectedFare.baseFare }}
              </strong>
            </div>

            <div
              v-if="selectedFare.perKm !== null"
              class="fare-row"
            >
              <span>Rate</span>
              <strong>
                ৳{{ selectedFare.perKm }}/km
              </strong>
            </div>

            <div
              v-if="selectedFare.discount > 0"
              class="fare-row discount"
            >
              <span>Coupon discount</span>
              <strong>
                - ৳{{ selectedFare.discount }}
              </strong>
            </div>

            <div class="fare-total">
              <div>
                <small>
                  Estimated fare
                </small>

                <span>
                  Calculated by Rooda server
                </span>
              </div>

              <strong>
                ৳{{ selectedFare.fare }}
              </strong>
            </div>

          </div>


          <!-- REQUEST -->

          <button
            v-if="
              pickupLocation &&
              dropoffLocation &&
              selectedFare
            "
            class="request-button"
            type="button"
            :disabled="requestLoading"
            @click="requestRide"
          >
            {{
              requestLoading
                ? 'Requesting ride...'
                : 'Request Ride'
            }}

            <span>→</span>
          </button>


          <!-- MESSAGE -->

          <div
            v-if="message"
            class="message"
            :class="messageType"
          >
            {{ message }}
          </div>

        </div>


        <!-- MAP -->

        <div class="map-panel">

          <div
            ref="mapContainer"
            class="map"
          ></div>


          <div class="map-top-card">
            <span></span>
            Dhaka service area
          </div>


          <!-- CENTER PIN -->

          <div
            v-if="mapSelecting"
            class="center-pin-container"
          >
            <div class="center-pin">
              <div class="pin-head"></div>
              <div class="pin-shadow"></div>
            </div>
          </div>


          <div
            v-if="mapSelecting"
            class="map-selection-panel"
          >
            <div>
              <small>
                Move the map to choose a location
              </small>

              <strong>
                {{
                  mapCenterLocation?.name ||
                  'Finding location...'
                }}
              </strong>
            </div>

            <button
              type="button"
              @click="confirmMapCenter"
            >
              Use this location
            </button>
          </div>


          <button
            v-if="!mapSelecting"
            class="locate-map-button"
            type="button"
            @click="
              useCurrentLocation(
                step === 'pickup'
                  ? 'pickup'
                  : 'dropoff'
              )
            "
          >
            ◎
          </button>

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

import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'


const router = useRouter()


const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000'

const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_ACCESS_TOKEN


/* =========================================================
   USER
========================================================= */

const userName = ref('User')

const userInitial = computed(() =>
  userName.value.charAt(0).toUpperCase()
)

const loadUserProfile = async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    router.push('/signin')
    return
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/core/user/profile`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.message || 'Failed to load profile'
      )
    }

    const firstName =
      data.first_name?.trim() || ''

    const lastName =
      data.last_name?.trim() || ''

    userName.value =
      `${lastName}`.trim() || 'User'

    localStorage.setItem(
      'user_name',
      userName.value
    )

  } catch (error) {
    console.error(
      'Profile loading error:',
      error
    )

    userName.value =
      localStorage.getItem('user_name') ||
      'User'
  }
}

const profileOpen = ref(false)


/* =========================================================
   RIDE STEP
========================================================= */

const step = ref('pickup')


/* =========================================================
   MAP
========================================================= */

const mapContainer = ref(null)

let map = null
let pickupMarker = null
let dropoffMarker = null

const DHAKA_CENTER = [
  90.4125,
  23.8103
]

const DHAKA_BOUNDS = [
  [90.25, 23.65],
  [90.55, 23.95]
]

const isInsideDhaka = (
  lat,
  lon
) => {

  const [
    [west, south],
    [east, north]
  ] = DHAKA_BOUNDS

  return (
    lon >= west &&
    lon <= east &&
    lat >= south &&
    lat <= north
  )
}


/* =========================================================
   LOCATION STATE
========================================================= */

const pickupQuery = ref('')
const dropoffQuery = ref('')

const pickupLocation = ref(null)
const dropoffLocation = ref(null)

const pickupSuggestions = ref([])
const dropoffSuggestions = ref([])

const pickupFocused = ref(false)
const dropoffFocused = ref(false)

const pickupLoading = ref(false)
const dropoffLoading = ref(false)

let pickupTimer = null
let dropoffTimer = null


/* =========================================================
   MAP SELECTION
========================================================= */

const mapSelecting = ref(false)

const mapSelectionType = ref(null)

const mapCenterLocation = ref(null)

let reverseTimer = null


const pendingLocation = ref(null)


/* =========================================================
   CURRENT LOCATION
========================================================= */

const locationLoading = ref(false)

const currentLocationTarget = ref(null)


/* =========================================================
   ROUTE
========================================================= */

const distance = ref(null)
const duration = ref(null)


/* =========================================================
   VEHICLES
========================================================= */

const vehicles = ref([])

const vehiclesLoading = ref(false)

const selectedVehicle = ref(null)


/* =========================================================
   FARES
========================================================= */

const fares = ref({})

const fareLoading = ref(false)


/* =========================================================
   COUPON
========================================================= */

const couponCode = ref('')

const couponMessage = ref('')

const couponMessageType = ref('success')


/* =========================================================
   REQUEST
========================================================= */

const requestLoading = ref(false)


/* =========================================================
   MESSAGE
========================================================= */

const message = ref('')

const messageType = ref('success')

let messageTimer = null


/* =========================================================
   AUTH
========================================================= */

const authHeaders = () => {

  const token =
    localStorage.getItem('token')

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}


/* =========================================================
   MAPBOX SEARCH
========================================================= */

const searchMapbox = async (query) => {
  if (!MAPBOX_TOKEN) {
    throw new Error('Mapbox token is missing')
  }

  const q = query.trim()

  if (q.length < 2) {
    return []
  }

  const url = new URL(
    'https://api.mapbox.com/search/searchbox/v1/suggest'
  )

  url.searchParams.set('q', q)

  url.searchParams.set(
    'session_token',
    getSessionToken()
  )

  url.searchParams.set(
    'access_token',
    MAPBOX_TOKEN
  )

  url.searchParams.set(
    'language',
    'en'
  )

  url.searchParams.set(
    'country',
    'BD'
  )

  url.searchParams.set(
    'limit',
    '10'
  )

  url.searchParams.set(
    'proximity',
    `${DHAKA_CENTER[0]},${DHAKA_CENTER[1]}`
  )

  const response = await fetch(url)

  if (!response.ok) {
    const errorText = await response.text()

    console.error(
      'Mapbox Search Box error:',
      response.status,
      errorText
    )

    throw new Error(
      `Mapbox search failed: ${response.status}`
    )
  }

  const data = await response.json()

  return data.suggestions || []
}

/* =========================================================
   SEARCH SESSION
========================================================= */

let searchSessionToken =
  crypto.randomUUID()

const getSessionToken = () => {

  if (!searchSessionToken) {
    searchSessionToken =
      crypto.randomUUID()
  }

  return searchSessionToken
}


const resetSearchSession = () => {
  searchSessionToken =
    crypto.randomUUID()
}


/* =========================================================
   RETRIEVE SEARCH RESULT
========================================================= */

const retrieveSearchResult = async (mapboxId) => {

  const url = new URL(
    `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}`
  )

  url.searchParams.set(
    'session_token',
    getSessionToken()
  )

  url.searchParams.set(
    'access_token',
    MAPBOX_TOKEN
  )

  url.searchParams.set(
    'language',
    'en'
  )

  const response = await fetch(url)

  if (!response.ok) {

    const errorText =
      await response.text()

    console.error(
      'Mapbox retrieve error:',
      response.status,
      errorText
    )

    throw new Error(
      `Mapbox retrieve failed: ${response.status}`
    )
  }

  const data =
    await response.json()

  const feature =
    data.features?.[0]

  if (!feature) {
    return null
  }

  const coordinates =
    feature.geometry?.coordinates

  if (
    !coordinates ||
    coordinates.length < 2
  ) {
    return null
  }

  const lon =
    Number(coordinates[0])

  const lat =
    Number(coordinates[1])

  const props =
    feature.properties || {}

  return {

    id:
      feature.id ||
      mapboxId,

    name:
      props.name ||
      props.name_preferred ||
      feature.text ||
      'Selected location',

    address:
      props.full_address ||
      props.place_formatted ||
      feature.place_name ||
      'Dhaka',

    lat,
    lon
  }
}

/* =========================================================
   REVERSE GEOCODING
========================================================= */

const reverseGeocode = async (
  lat,
  lon
) => {

  if (!MAPBOX_TOKEN) {

    return {

      name:
        'Selected location',

      address:
        `${lat.toFixed(5)}, ${lon.toFixed(5)}`,

      lat,
      lon
    }
  }


  const url =
    new URL(
      'https://api.mapbox.com/search/searchbox/v1/reverse'
    )


  url.searchParams.set(
    'longitude',
    String(lon)
  )

  url.searchParams.set(
    'latitude',
    String(lat)
  )

  url.searchParams.set(
    'language',
    'en'
  )

  url.searchParams.set(
    'limit',
    '10'
  )

  url.searchParams.set(
    'access_token',
    MAPBOX_TOKEN
  )


  const response =
    await fetch(url)


  if (!response.ok) {

    const errorText =
      await response.text()

    console.error(
      'Mapbox reverse error:',
      response.status,
      errorText
    )

    /*
     * Don't make map selection fail
     * just because Mapbox couldn't
     * give us a name.
     */

    return {

      name:
        'Selected location',

      address:
        `${lat.toFixed(5)}, ${lon.toFixed(5)}`,

      lat,
      lon
    }
  }


  const data =
    await response.json()


  const features =
    data.features || []


  if (!features.length) {

    return {

      name:
        'Selected location',

      address:
        `${lat.toFixed(5)}, ${lon.toFixed(5)}`,

      lat,
      lon
    }
  }


  /*
   * Prefer named POI.
   */

  let selected =
    features.find(
      feature => {

        const props =
          feature.properties || {}

        const name =
          props.name ||
          feature.text ||
          ''

        const type =
          props.feature_type ||
          feature.properties?.feature_type ||
          feature.place_type?.[0] ||
          ''

        return (
          type === 'poi' &&
          name &&
          !/^\d+$/.test(
            name.trim()
          )
        )
      }
    )


  /*
   * Otherwise choose any meaningful
   * named feature.
   */

  if (!selected) {

    selected =
      features.find(
        feature => {

          const props =
            feature.properties || {}

          const name =
            props.name ||
            feature.text ||
            ''

          return (
            name &&
            !/^\d+$/.test(
              name.trim()
            )
          )
        }
      )
  }


  if (!selected) {

    return {

      name:
        'Selected location',

      address:
        `${lat.toFixed(5)}, ${lon.toFixed(5)}`,

      lat,
      lon
    }
  }


  const props =
    selected.properties || {}


  const name =
    props.name ||
    selected.text ||
    'Selected location'


  const address =
    props.full_address ||
    props.place_formatted ||
    selected.place_name ||
    `${lat.toFixed(5)}, ${lon.toFixed(5)}`


  return {

    name,

    address,

    lat,

    lon
  }
}

/* =========================================================
   PICKUP AUTOCOMPLETE
========================================================= */

const onPickupInput = () => {

  pickupLocation.value = null

  pickupSuggestions.value = []

  clearTimeout(
    pickupTimer
  )

  const query =
    pickupQuery.value.trim()


  if (query.length < 2) {
    pickupFocused.value = false
    return
  }


  pickupFocused.value = true

  pickupTimer =
    setTimeout(
      async () => {

        pickupLoading.value = true

        try {

          pickupSuggestions.value =
            await searchMapbox(query)

        } catch (error) {

          console.error(
            error
          )

          showMessage(
            'Location search failed.',
            'error'
          )

        } finally {

          pickupLoading.value = false

        }

      },
      300
    )
}


/* =========================================================
   DROPOFF AUTOCOMPLETE
========================================================= */

const onDropoffInput = () => {

  dropoffLocation.value = null

  dropoffSuggestions.value = []

  clearTimeout(
    dropoffTimer
  )

  const query =
    dropoffQuery.value.trim()


  if (query.length < 2) {
    dropoffFocused.value = false
    return
  }


  dropoffFocused.value = true

  dropoffTimer =
    setTimeout(
      async () => {

        dropoffLoading.value = true

        try {

          dropoffSuggestions.value =
            await searchMapbox(query)

        } catch (error) {

          console.error(
            error
          )

          showMessage(
            'Location search failed.',
            'error'
          )

        } finally {

          dropoffLoading.value = false

        }

      },
      300
    )
}


/* =========================================================
   SEARCH RESULT SELECTION
========================================================= */

const chooseSearchResult = async (
  suggestion,
  type
) => {

  try {

    resetSearchSession()

    const place =
      await retrieveSearchResult(
        suggestion.mapbox_id
      )

    if (!place) {

      showMessage(
        'Could not determine the selected location.',
        'error'
      )

      return
    }

    if (
      !isInsideDhaka(
        place.lat,
        place.lon
      )
    ) {

      showMessage(
        'This location is outside the Dhaka service area.',
        'error'
      )

      return
    }


    if (type === 'pickup') {

      pickupQuery.value =
        place.name

      pickupSuggestions.value =
        []

      pickupFocused.value =
        false

    } else {

      dropoffQuery.value =
        place.name

      dropoffSuggestions.value =
        []

      dropoffFocused.value =
        false
    }


    await setConfirmedLocation(
      place,
      type
    )

  } catch (error) {

    console.error(
      'Location selection error:',
      error
    )

    showMessage(
      'Could not select this location.',
      'error'
    )
  }
}

/* =========================================================
   MAP SELECTION
========================================================= */

const startMapSelection = type => {

  mapSelectionType.value =
    type

  mapSelecting.value =
    true

  pendingLocation.value =
    null


  if (map) {

    const center =
      map.getCenter()

    updateMapCenter(
      center.lat,
      center.lng
    )
  }
}


/* =========================================================
   MAP MOVEMENT
========================================================= */

const handleMapMove = () => {

  if (!mapSelecting.value) {
    return
  }

  const center =
    map.getCenter()

  clearTimeout(
    reverseTimer
  )

  reverseTimer =
    setTimeout(
      () => {

        updateMapCenter(
          center.lat,
          center.lng
        )

      },
      300
    )
}


/* =========================================================
   UPDATE MAP CENTER LOCATION
========================================================= */

const updateMapCenter = async (
  lat,
  lon
) => {

  if (
    !isInsideDhaka(
      lat,
      lon
    )
  ) {

    mapCenterLocation.value = {
      name: 'Outside service area',
      address:
        'Move the map inside Dhaka',
      lat,
      lon
    }

    return
  }


  mapCenterLocation.value = null


  try {

    const place =
      await reverseGeocode(
        lat,
        lon
      )

    mapCenterLocation.value =
      place

  } catch (error) {

    console.error(
      error
    )

    mapCenterLocation.value = {
      name: 'Selected location',
      address:
        `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
      lat,
      lon
    }
  }
}


/* =========================================================
   CONFIRM MAP CENTER
========================================================= */

const confirmMapCenter = async () => {

  if (
    !mapCenterLocation.value
  ) {
    return
  }


  if (
    !isInsideDhaka(
      mapCenterLocation.value.lat,
      mapCenterLocation.value.lon
    )
  ) {

    showMessage(
      'Please select a location inside Dhaka.',
      'error'
    )

    return
  }


  pendingLocation.value =
    mapCenterLocation.value

  mapSelecting.value =
    false


  await confirmPendingLocation()
}


/* =========================================================
   CONFIRM PENDING LOCATION
========================================================= */

const confirmPendingLocation =
  async () => {

    if (!pendingLocation.value) {
      return
    }

    const type =
      mapSelectionType.value ||
      step.value


    await setConfirmedLocation(
      pendingLocation.value,
      type
    )


    pendingLocation.value =
      null
  }


/* =========================================================
   SET CONFIRMED LOCATION
========================================================= */

const setConfirmedLocation = async (
  place,
  type
) => {

  if (
    !isInsideDhaka(
      place.lat,
      place.lon
    )
  ) {

    showMessage(
      'This location is outside the Dhaka service area.',
      'error'
    )

    return
  }


  if (type === 'pickup') {

    pickupLocation.value =
      place

    pickupQuery.value =
      place.name ||
      'Selected location'

    pickupSuggestions.value =
      []

    pickupFocused.value =
      false

    setMarker(
      'pickup',
      place
    )

    step.value =
      'dropoff'

  } else {

    dropoffLocation.value =
      place

    dropoffQuery.value =
      place.name ||
      'Selected location'

    dropoffSuggestions.value =
      []

    dropoffFocused.value =
      false

    setMarker(
      'dropoff',
      place
    )

    step.value =
      'complete'
  }


  if (map) {

    map.flyTo({

      center: [
        place.lon,
        place.lat
      ],

      zoom: 15,

      duration: 700
    })
  }


  /*
   * Only calculate route after
   * both locations are confirmed.
   */

  if (
    pickupLocation.value &&
    dropoffLocation.value
  ) {

    await refreshRouteAndFare()

  } else {

    showMessage(

      type === 'pickup'
        ? 'Pickup confirmed. Now select your destination.'
        : 'Destination confirmed.',

      'success'
    )
  }
}

/* =========================================================
   CANCEL PENDING LOCATION
========================================================= */

const cancelPendingLocation = () => {

  pendingLocation.value =
    null
}


/* =========================================================
   CLEAR PICKUP
========================================================= */

const clearPickup = () => {

  pickupQuery.value = ''

  pickupLocation.value =
    null

  pickupSuggestions.value =
    []

  step.value =
    'pickup'

  distance.value =
    null

  duration.value =
    null

  fares.value =
    {}

  selectedVehicle.value =
    null

  removeRoute()
}


/* =========================================================
   CLEAR DROPOFF
========================================================= */

const clearDropoff = () => {

  dropoffQuery.value = ''

  dropoffLocation.value =
    null

  dropoffSuggestions.value =
    []

  step.value =
    'dropoff'

  distance.value =
    null

  duration.value =
    null

  fares.value =
    {}

  selectedVehicle.value =
    null

  removeRoute()
}


/* =========================================================
   CHANGE LOCATIONS
========================================================= */

const changeLocations = () => {

  step.value =
    'pickup'

  dropoffLocation.value =
    null

  dropoffQuery.value =
    ''

  distance.value =
    null

  duration.value =
    null

  fares.value =
    {}

  selectedVehicle.value =
    null

  removeRoute()
}


/* =========================================================
   CURRENT LOCATION
========================================================= */

const useCurrentLocation =
  type => {

    if (!navigator.geolocation) {

      showMessage(
        'Your browser does not support location services.',
        'error'
      )

      return
    }


    locationLoading.value =
      true

    currentLocationTarget.value =
      type


    navigator.geolocation.getCurrentPosition(

      async position => {

        const lat =
          position.coords.latitude

        const lon =
          position.coords.longitude


        locationLoading.value =
          false

        currentLocationTarget.value =
          null


        if (
          !isInsideDhaka(
            lat,
            lon
          )
        ) {

          showMessage(
            'Your current location is outside Dhaka.',
            'error'
          )

          return
        }


        try {

          const place =
            await reverseGeocode(
              lat,
              lon
            )


          if (map) {

            map.flyTo({
              center: [
                lon,
                lat
              ],

              zoom: 16,

              duration: 700
            })

          }


          await setConfirmedLocation(
            place,
            type
          )

        } catch (error) {

          console.error(
            error
          )

          showMessage(
            'Could not determine your current location.',
            'error'
          )
        }
      },

      error => {

        locationLoading.value =
          false

        currentLocationTarget.value =
          null


        if (error.code === 1) {

          showMessage(
            'Location permission was denied.',
            'error'
          )

        } else {

          showMessage(
            'Unable to get your current location.',
            'error'
          )
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    )
  }


/* =========================================================
   ROUTE
========================================================= */

const drawRoute = async () => {

  if (
    !map ||
    !pickupLocation.value ||
    !dropoffLocation.value
  ) {
    return
  }


  const coordinates =
    `${pickupLocation.value.lon},${pickupLocation.value.lat};` +
    `${dropoffLocation.value.lon},${dropoffLocation.value.lat}`


  const url =
    new URL(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}`
    )


  url.searchParams.set(
    'alternatives',
    'false'
  )

  url.searchParams.set(
    'geometries',
    'geojson'
  )

  url.searchParams.set(
    'overview',
    'full'
  )

  url.searchParams.set(
    'access_token',
    MAPBOX_TOKEN
  )


  const response =
    await fetch(url)


  if (!response.ok) {

    throw new Error(
      `Directions failed: ${response.status}`
    )
  }


  const data =
    await response.json()


  const route =
    data.routes?.[0]


  if (!route) {

    throw new Error(
      'No driving route found'
    )
  }


  distance.value =
    Number(
      (
        route.distance /
        1000
      ).toFixed(2)
    )


  duration.value =
    Math.max(
      1,
      Math.round(
        route.duration /
        60
      )
    )


  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: route.geometry
  }


  if (
    map.getSource('route')
  ) {

    map
      .getSource('route')
      .setData(
        geojson
      )

  } else {

    map.addSource(
      'route',
      {
        type: 'geojson',
        data: geojson
      }
    )


    map.addLayer({
      id: 'route-line',

      type: 'line',

      source: 'route',

      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },

      paint: {
        'line-color': '#20df4f',
        'line-width': 5,
        'line-opacity': 0.85
      }
    })
  }


  const bounds =
    new mapboxgl.LngLatBounds()

  bounds.extend([
    pickupLocation.value.lon,
    pickupLocation.value.lat
  ])

  bounds.extend([
    dropoffLocation.value.lon,
    dropoffLocation.value.lat
  ])

  map.fitBounds(
    bounds,
    {
      padding: 100,
      duration: 700
    }
  )
}


/* =========================================================
   REMOVE ROUTE
========================================================= */

const removeRoute = () => {

  if (!map) {
    return
  }


  if (
    map.getLayer('route-line')
  ) {

    map.removeLayer(
      'route-line'
    )
  }


  if (
    map.getSource('route')
  ) {

    map.removeSource(
      'route'
    )
  }
}


/* =========================================================
   LOAD VEHICLES
========================================================= */

const loadVehicles = async () => {

  vehiclesLoading.value =
    true


  try {

    const response =
      await fetch(
        `${API_BASE_URL}/core/vehicles/types`,
        {
          headers:
            authHeaders()
        }
      )


    const data =
      await response.json()
        .catch(
          () => ({})
        )


    if (!response.ok) {

      throw new Error(
        data.message ||
        `Vehicle request failed: ${response.status}`
      )
    }


    const list =
      data.vehicles ||
      data.vehicleTypes ||
      data.data ||
      []


    vehicles.value =
      list
        .map(vehicle => ({
          id:
            vehicle.id ||
            vehicle.vehicle_type_id ||
            vehicle.type,

          type:
            String(
              vehicle.type ||
              vehicle.vehicle_type ||
              vehicle.name ||
              ''
            ).toUpperCase(),

          name:
            vehicle.name ||
            vehicle.vehicle_type ||
            vehicle.type,

          description:
            vehicle.description ||
            '',

          icon:
            vehicle.icon ||
            '🚗'
        }))
        .filter(
          vehicle =>
            vehicle.type
        )


    if (
      !selectedVehicle.value &&
      vehicles.value.length
    ) {

      selectedVehicle.value =
        vehicles.value[0].type
    }

  } catch (error) {

    console.error(
      'Vehicle loading error:',
      error
    )

    showMessage(
      'Could not load vehicle types.',
      'error'
    )

  } finally {

    vehiclesLoading.value =
      false
  }
}


/* =========================================================
   CALCULATE FARES
========================================================= */

const calculateAllFares =
  async () => {

    if (
      distance.value === null
    ) {
      return
    }


    fareLoading.value =
      true


    try {

      const response =
        await fetch(
          `${API_BASE_URL}/core/rides/fare`,
          {
            method: 'POST',

            headers:
              authHeaders(),

            body:
              JSON.stringify({
                distance:
                  distance.value,

                couponCode:
                  couponCode.value.trim() ||
                  null
              })
          }
        )


      const data =
        await response.json()
          .catch(
            () => ({})
          )


      if (!response.ok) {

        throw new Error(
          data.message ||
          `Fare request failed: ${response.status}`
        )
      }


      const list =
        data.fares ||
        data.data ||
        []


      const mapData = {}


      list.forEach(
        fare => {

          const type =
            String(
              fare.vehicleType ||
              fare.type ||
              ''
            ).toUpperCase()


          if (!type) {
            return
          }


          mapData[type] = {

            fare:
              Number(
                fare.fare ??
                fare.estimatedFare ??
                fare.finalFare ??
                0
              ),

            baseFare:
              fare.baseFare ??
              null,

            perKm:
              fare.perKm ??
              fare.per_km ??
              null,

            discount:
              Number(
                fare.discount ??
                fare.couponDiscount ??
                0
              )
          }
        }
      )


      fares.value =
        mapData


    } catch (error) {

      console.error(
        'Fare calculation error:',
        error
      )

      showMessage(
        error.message ||
        'Could not calculate fares.',
        'error'
      )

    } finally {

      fareLoading.value =
        false
    }
  }


/* =========================================================
   REFRESH ROUTE + FARE
========================================================= */

const refreshRouteAndFare =
  async () => {

    fares.value =
      {}


    if (
      !pickupLocation.value ||
      !dropoffLocation.value
    ) {
      return
    }


    try {

      await drawRoute()

      await loadVehicles()

      await calculateAllFares()

    } catch (error) {

      console.error(
        error
      )

      showMessage(
        'Could not build the route.',
        'error'
      )
    }
  }


/* =========================================================
   FARE HELPERS
========================================================= */

const fareFor =
  type =>
    fares.value[type]?.fare ??
    null


const selectedFare =
  computed(() => {

    if (
      !selectedVehicle.value
    ) {
      return null
    }

    return (
      fares.value[
        selectedVehicle.value
      ] ||
      null
    )
  })


const selectedVehicleData =
  computed(() =>
    vehicles.value.find(
      vehicle =>
        vehicle.type ===
        selectedVehicle.value
    ) || null
  )


/* =========================================================
   COUPON
========================================================= */

const applyCoupon = async () => {

  if (
    !couponCode.value.trim()
  ) {

    couponMessage.value =
      'Enter a coupon code.'

    couponMessageType.value =
      'error'

    return
  }


  if (
    !distance.value
  ) {

    couponMessage.value =
      'Select pickup and destination first.'

    couponMessageType.value =
      'error'

    return
  }


  couponMessage.value =
    'Validating coupon...'

  couponMessageType.value =
    'success'


  await calculateAllFares()


  if (
    Object.keys(
      fares.value
    ).length
  ) {

    couponMessage.value =
      'Coupon checked by the server.'

  } else {

    couponMessage.value =
      'Coupon could not be applied.'

    couponMessageType.value =
      'error'
  }
}


/* =========================================================
   REQUEST RIDE
========================================================= */

const requestRide = async () => {

  if (
    !pickupLocation.value ||
    !dropoffLocation.value ||
    !selectedVehicle.value ||
    !selectedFare.value
  ) {

    showMessage(
      'Please complete the ride details first.',
      'error'
    )

    return
  }


  requestLoading.value =
    true


  try {

    const payload = {

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

      duration:
        duration.value,

      vehicleType:
        selectedVehicle.value,

      coupon:
        couponCode.value.trim() ||
        null
    }


    const response =
      await fetch(
        `${API_BASE_URL}/core/rides/request`,
        {
          method: 'POST',

          headers:
            authHeaders(),

          body:
            JSON.stringify(payload)
        }
      )


    const data =
      await response.json()
        .catch(
          () => ({})
        )


    if (!response.ok) {

      if (
        response.status === 401
      ) {

        localStorage.clear()

        router.push(
          '/signin'
        )

        return
      }


      throw new Error(
        data.message ||
        'Ride request failed'
      )
    }


    const rideId =
  data.rideId ||
  data.ride?.rideId ||
  data.ride?.ride_id ||
  data.data?.rideId

if (!rideId) {

  throw new Error(
    'Ride was created but ride ID was not returned.'
  )

}

router.push({
  name: 'ride-searching',
  params: {
    rideId
  }
})

  } catch (error) {

    console.error(
      'Request ride error:',
      error
    )

    showMessage(
      error.message ||
      'Unable to request ride.',
      'error'
    )

  } finally {

    requestLoading.value =
      false
  }
}


/* =========================================================
   MESSAGE
========================================================= */

const showMessage = (
  text,
  type = 'success'
) => {

  message.value =
    text

  messageType.value =
    type


  clearTimeout(
    messageTimer
  )


  messageTimer =
    setTimeout(
      () => {
        message.value = ''
      },
      4000
    )
}


/* =========================================================
   PROFILE
========================================================= */

const goToProfile = () => {

  profileOpen.value =
    false

  router.push(
    '/profile'
  )
}


const signOut = () => {

  localStorage.clear()

  profileOpen.value =
    false

  router.push(
    '/'
  )
}


/* =========================================================
   MAP INITIALIZATION
========================================================= */

const initializeMap = () => {

  if (
    !mapContainer.value
  ) {

    console.error(
      'Map container missing'
    )

    return
  }


  if (
    !MAPBOX_TOKEN
  ) {

    console.error(
      'VITE_MAPBOX_ACCESS_TOKEN is missing'
    )

    return
  }


  mapboxgl.accessToken =
    MAPBOX_TOKEN


  map =
    new mapboxgl.Map({

      container:
        mapContainer.value,

      style:
        'mapbox://styles/mapbox/streets-v12',

      center:
        DHAKA_CENTER,

      zoom:
        12,

      minZoom:
        10,

      maxZoom:
        18

    })


  map.addControl(
    new mapboxgl.NavigationControl(),
    'top-right'
  )


  map.on(
    'load',
    () => {

      map.resize()

    }
  )


  map.on(
    'move',
    handleMapMove
  )

  map.on(
  'click',
  handleMapClick
)
}

const handleMapClick = async event => {

  const lat =
    event.lngLat.lat

  const lon =
    event.lngLat.lng


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


  let type

  if (!pickupLocation.value) {

    type = 'pickup'

  } else if (!dropoffLocation.value) {

    type = 'dropoff'

  } else {

    /*
     * If both already exist,
     * replace pickup.
     */

    type = 'pickup'
  }


  try {

    const place =
      await reverseGeocode(
        lat,
        lon
      )


    await setConfirmedLocation(
      place,
      type
    )


  } catch (error) {

    console.error(
      'Map selection error:',
      error
    )


    /*
     * Even if reverse geocoding
     * fails, the coordinate itself
     * is still usable.
     */

    const fallback = {

      name:
        'Selected location',

      address:
        `${lat.toFixed(5)}, ${lon.toFixed(5)}`,

      lat,
      lon
    }


    await setConfirmedLocation(
      fallback,
      type
    )
  }
}


/* =========================================================
   GLOBAL CLICK
========================================================= */

const handleDocumentClick =
  event => {

    if (
      !event.target.closest(
        '.profile-area'
      )
    ) {

      profileOpen.value =
        false
    }


    if (
      !event.target.closest(
        '.search-box'
      )
    ) {

      pickupFocused.value =
        false

      dropoffFocused.value =
        false
    }
  }


/* =========================================================
   LIFECYCLE
========================================================= */

onMounted(async () => {
  await loadUserProfile()

  initializeMap()

  document.addEventListener(
    'click',
    closeMenus
  )

  await loadVehicles()
})


onBeforeUnmount(
  () => {

    map?.remove()

    clearTimeout(
      pickupTimer
    )

    clearTimeout(
      dropoffTimer
    )

    clearTimeout(
      reverseTimer
    )

    clearTimeout(
      messageTimer
    )

    document.removeEventListener(
      'click',
      handleDocumentClick
    )
  }
)
const createMarkerElement = type => {

  const wrapper =
    document.createElement('div')

  wrapper.className =
    `ride-marker ${type}`


  const inner =
    document.createElement('div')

  inner.className =
    'ride-marker-inner'


  const label =
    document.createElement('span')

  label.className =
    'ride-marker-label'

  label.textContent =
    type === 'pickup'
      ? 'P'
      : 'D'


  inner.appendChild(label)

  wrapper.appendChild(inner)

  return wrapper
}
const setMarker = (
  type,
  location
) => {

  if (!map) {
    return
  }


  if (
    type === 'pickup' &&
    pickupMarker
  ) {

    pickupMarker.remove()

    pickupMarker =
      null
  }


  if (
    type === 'dropoff' &&
    dropoffMarker
  ) {

    dropoffMarker.remove()

    dropoffMarker =
      null
  }


  const marker =
    new mapboxgl.Marker({

      element:
        createMarkerElement(type),

      draggable:
        true,

      anchor:
        'bottom'

    })
      .setLngLat([
        location.lon,
        location.lat
      ])
      .addTo(map)


  marker.on(
    'dragend',
    () => {

      handleMarkerDrag(
        type,
        marker
      )

    }
  )


  if (type === 'pickup') {

    pickupMarker =
      marker

  } else {

    dropoffMarker =
      marker
  }
}

</script>


<style scoped>

:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  font-family:
    Inter,
    Arial,
    sans-serif;
}

.home-page {
  min-height: 100vh;
  min-width: 100vw;
  background:
    linear-gradient(
      135deg,
      #ffffff,
      #f4f7f4
    );
  color: #111;
}

.navbar {
  height: 82px;
  padding: 0 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255,255,255,.92);
  border-bottom: 1px solid #e7e9e7;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-text {
  font-size: 30px;
  font-weight: 750;
}

.logo-mark {
  width: 31px;
  height: 31px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px;
}

.logo-mark span {
  background: #20df4f;
  border-radius: 50%;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-links a {
  color: #555;
  text-decoration: none;
  font-size: 14px;
}

.nav-links a:hover {
  color: #159b36;
}

.profile-area {
  position: relative;
}

.profile-button {
  border: 0;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
}

.profile-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #20df4f;
  font-weight: 700;
}

.profile-name {
  font-size: 13px;
  font-weight: 650;
}

.profile-arrow {
  color: #777;
}

.profile-menu {
  position: absolute;
  right: 0;
  top: 48px;
  width: 170px;
  padding: 7px;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0,0,0,.12);
}

.profile-menu button {
  width: 100%;
  padding: 11px 12px;
  border: 0;
  background: transparent;
  text-align: left;
  border-radius: 8px;
  cursor: pointer;
}

.profile-menu button:hover {
  background: #f2f5f2;
}

.page-content {
  width: min(1600px, calc(100% - 48px));
  margin: 0 auto;
  padding: 40px 0;
}

.welcome {
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #159b36;
  font-size: 12px;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.welcome h1 {
  margin: 0;
  font-size: 38px;
  letter-spacing: -1.5px;
}

.welcome h1 span {
  color: #159b36;
}

.welcome p:last-child {
  color: #777;
  margin-top: 10px;
}

.ride-layout {
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
  width: 100%;
  min-height: 100vh;
  border-radius: 22px;
  overflow: hidden;
  background: white;
  box-shadow: 0 18px 55px rgba(0,0,0,.09);
}


.ride-panel {
  width: 100%;
  min-width: 0;
  padding: 28px;
  overflow-y: auto;
  max-height: 100vh;
}

.panel-title {
  display: flex;
  justify-content: space-between;
  margin-bottom: 27px;
}

.panel-title h2 {
  margin: 0 0 5px;
  font-size: 22px;
}

.panel-title p {
  margin: 0;
  color: #858585;
  font-size: 12px;
}

.progress {
  display: flex;
  gap: 5px;
}

.progress span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
}

.progress span.active {
  background: #20df4f;
}

.location-section {
  position: relative;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
  font-weight: 750;
  margin-bottom: 9px;
}

.green-dot,
.red-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.green-dot {
  background: #20df4f;
}

.red-dot {
  background: #ef5350;
}

.search-box {
  position: relative;
}

.search-box input {
  width: 100%;
  height: 52px;
  padding: 0 42px 0 15px;
  border: 1px solid #ddd;
  border-radius: 12px;
  outline: none;
  font-size: 13px;
}

.search-box input:focus {
  border-color: #20df4f;
  box-shadow: 0 0 0 3px rgba(32,223,79,.1);
}

.clear-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  font-size: 20px;
  color: #888;
  cursor: pointer;
}

.suggestions {
  margin-top: 5px;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0,0,0,.09);
  position: relative;
  z-index: 30;
}

.suggestion {
  width: 100%;
  display: flex;
  gap: 12px;
  padding: 13px;
  border: 0;
  background: white;
  text-align: left;
  cursor: pointer;
}

.suggestion:hover {
  background: #f4f8f4;
}

.suggestion-icon {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #edf7ef;
  color: #159b36;
}

.suggestion-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.suggestion-content strong {
  font-size: 13px;
}

.suggestion-content small {
  color: #777;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading-suggestion {
  padding: 14px;
  font-size: 12px;
  color: #777;
}

.current-location,
.map-select-button {
  width: 100%;
  height: 46px;
  margin-top: 10px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 650;
}

.current-location {
  border: 1px solid #dfe7df;
  background: #f5faf5;
  color: #159b36;
}

.map-select-button {
  border: 1px solid #ddd;
  background: white;
  color: #555;
}

.current-location:hover,
.map-select-button:hover {
  border-color: #20df4f;
}

.selected-preview {
  margin-top: 16px;
  padding: 16px;
  background: #f5faf5;
  border: 1px solid #dfeee0;
  border-radius: 12px;
}

.preview-title {
  color: #159b36;
  font-size: 10px;
  font-weight: 750;
  text-transform: uppercase;
  margin-bottom: 7px;
}

.selected-preview strong {
  display: block;
  font-size: 14px;
}

.selected-preview small {
  display: block;
  color: #777;
  font-size: 11px;
  margin-top: 4px;
  line-height: 1.5;
}

.preview-actions {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

.preview-actions button {
  flex: 1;
  height: 38px;
  border-radius: 8px;
  border: 0;
  cursor: pointer;
  font-size: 11px;
  font-weight: 700;
}

.preview-actions button:first-child {
  background: #20df4f;
}

.preview-actions button:last-child {
  background: #e9ece9;
}

.route-summary {
  margin-top: 25px;
  padding: 17px;
  background: #f7f8f7;
  border-radius: 14px;
  position: relative;
}

.route-location {
  display: flex;
  gap: 11px;
  align-items: flex-start;
}

.route-location small {
  display: block;
  color: #888;
  font-size: 10px;
}

.route-location strong {
  display: block;
  font-size: 12px;
  margin-top: 3px;
}

.route-dot {
  width: 9px;
  height: 9px;
  margin-top: 3px;
  border-radius: 50%;
}

.route-dot.pickup {
  background: #20df4f;
}

.route-dot.dropoff {
  background: #ef5350;
}

.route-line {
  width: 1px;
  height: 20px;
  margin-left: 4px;
  background: #ccc;
}

.change-route {
  position: absolute;
  right: 12px;
  top: 12px;
  border: 0;
  background: transparent;
  color: #159b36;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.distance-card {
  margin-top: 14px;
  padding: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  background: #111;
  color: white;
  border-radius: 13px;
}

.distance-card small {
  display: block;
  color: #aaa;
  font-size: 10px;
}

.distance-card strong {
  display: block;
  margin-top: 5px;
  font-size: 15px;
}

.vehicle-section {
  margin-top: 25px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-heading h3 {
  margin: 0;
  font-size: 14px;
}

.section-heading span {
  color: #888;
  font-size: 10px;
}

.vehicle-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.vehicle-card {
  width: 100%;
  padding: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e2e5e2;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
}

.vehicle-card:hover {
  border-color: #20df4f;
}

.vehicle-card.selected {
  border-color: #20df4f;
  background: #f5fff6;
}

.vehicle-main {
  display: flex;
  gap: 11px;
  align-items: center;
}

.vehicle-icon {
  width: 39px;
  height: 39px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #f0f3f0;
}

.vehicle-main strong {
  display: block;
  font-size: 12px;
}

.vehicle-main small {
  display: block;
  color: #888;
  font-size: 10px;
  margin-top: 3px;
}

.vehicle-fare {
  font-size: 14px;
  font-weight: 750;
}

.coupon-section {
  margin-top: 22px;
}

.coupon-section h3 {
  margin: 0 0 8px;
  font-size: 13px;
}

.coupon-row {
  display: flex;
  gap: 7px;
}

.coupon-row input {
  min-width: 0;
  flex: 1;
  height: 43px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 9px;
  outline: none;
}

.coupon-row button {
  width: 72px;
  border: 0;
  border-radius: 9px;
  background: #111;
  color: white;
  cursor: pointer;
}

.coupon-section p {
  font-size: 10px;
  margin: 7px 0;
}

.coupon-section p.error {
  color: #d33;
}

.coupon-section p.success {
  color: #159b36;
}

.fare-card {
  margin-top: 20px;
  padding: 18px;
  border: 1px solid #e4e7e4;
  border-radius: 14px;
}

.fare-row {
  display: flex;
  justify-content: space-between;
  padding: 7px 0;
  font-size: 12px;
}

.fare-row span {
  color: #777;
}

.fare-row.discount {
  color: #159b36;
}

.fare-total {
  margin-top: 9px;
  padding-top: 14px;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fare-total small {
  display: block;
  font-size: 12px;
  font-weight: 700;
}

.fare-total span {
  display: block;
  margin-top: 3px;
  color: #999;
  font-size: 9px;
}

.fare-total > strong {
  font-size: 22px;
}

.request-button {
  width: 100%;
  height: 52px;
  margin-top: 13px;
  border: 0;
  border-radius: 12px;
  background: #20df4f;
  color: #111;
  font-weight: 800;
  cursor: pointer;
}

.request-button:disabled {
  opacity: .55;
  cursor: not-allowed;
}

.request-button span {
  float: right;
  margin-right: 15px;
}

.empty-box {
  margin-top: 10px;
  padding: 15px;
  border-radius: 10px;
  background: #f5f5f5;
  color: #777;
  font-size: 11px;
}

.empty-box.error {
  color: #c33;
}

.message {
  margin-top: 12px;
  padding: 11px;
  border-radius: 9px;
  font-size: 11px;
}

.message.success {
  background: #edfaef;
  color: #159b36;
}

.message.error {
  background: #fff0f0;
  color: #c33;
}

.map-panel {
  position: relative;
  width: 100%;
  min-width: 90%;
  min-height: 100vh;
  overflow: hidden;
}

.map {
  position: relative;
  inset: 0;
  width: 100%;
  height: 100%;
}

.map-top-card {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 10px 13px;
  border-radius: 10px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 7px 20px rgba(0,0,0,.12);
  font-size: 11px;
  font-weight: 650;
  z-index: 5;
}

.map-top-card span {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 6px;
  border-radius: 50%;
  background: #20df4f;
}

.locate-map-button {
  position: absolute;
  right: 16px;
  bottom: 18px;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  background: white;
  box-shadow: 0 7px 20px rgba(0,0,0,.15);
  cursor: pointer;
  font-size: 20px;
  z-index: 5;
}

.center-pin-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  z-index: 10;
  pointer-events: none;
}

.center-pin {
  position: relative;
  width: 42px;
  height: 55px;
}

.pin-head {
  position: absolute;
  left: 7px;
  top: 0;
  width: 28px;
  height: 28px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: #20df4f;
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(0,0,0,.25);
}

.pin-shadow {
  position: absolute;
  bottom: 0;
  left: 12px;
  width: 18px;
  height: 5px;
  border-radius: 50%;
  background: rgba(0,0,0,.22);
}

.map-selection-panel {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  background: rgba(255,255,255,.96);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,.16);
  z-index: 10;
}

.map-selection-panel small {
  display: block;
  color: #888;
  font-size: 10px;
}

.map-selection-panel strong {
  display: block;
  margin-top: 4px;
  font-size: 13px;
}

.map-selection-panel button {
  flex-shrink: 0;
  height: 42px;
  padding: 0 16px;
  border: 0;
  border-radius: 9px;
  background: #20df4f;
  font-size: 11px;
  font-weight: 750;
  cursor: pointer;
}

.ride-marker {
  width: 42px;
  height: 50px;
  position: relative;
  cursor: grab;
}

.ride-marker:active {
  cursor: grabbing;
}

.ride-marker-inner {
  width: 36px;
  height: 36px;

  position: absolute;
  top: 0;
  left: 3px;

  border-radius: 50% 50% 50% 0;

  transform:
    rotate(-45deg);

  border: 4px solid white;

  box-shadow:
    0 4px 14px
    rgba(0, 0, 0, .3);

  display: flex;
  align-items: center;
  justify-content: center;
}

.ride-marker.pickup
.ride-marker-inner {
  background: #20df4f;
}

.ride-marker.dropoff
.ride-marker-inner {
  background: #ff4f5f;
}

.ride-marker-label {
  transform:
    rotate(45deg);

  color: white;

  font-size: 12px;

  font-weight: 800;
}

@media (max-width: 1000px) {

  .nav-links {
    display: none;
  }

  .ride-layout {
    grid-template-columns: 1fr;
  }

  .map-panel {
    min-height: 520px;
    order: -1;
  }

  .ride-panel {
    max-height: none;
  }
}

@media (max-width: 600px) {

  .navbar {
    padding: 0 20px;
  }

  .profile-name {
    display: none;
  }

  .page-content {
    width: 94%;
    padding: 25px 0;
  }

  .welcome h1 {
    font-size: 29px;
  }

  .ride-panel {
    padding: 20px;
  }

  .map-panel {
    min-height: 420px;
  }
}


</style>
```
