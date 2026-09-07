<template>
  <div class="home-page">
    <!-- NAVBAR -->
    <nav class="navbar">
      <div class="logo">
        <div class="logo-icon">
          <span></span><span></span><span></span><span></span>
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
          class="profile-btn"
          type="button"
          @click.stop="profileOpen = !profileOpen"
        >
          <span class="profile-icon">{{ userInitial }}</span>
          <span>Hi, {{ userName }}</span>
          <span class="profile-arrow">▾</span>
        </button>

        <div v-if="profileOpen" class="profile-menu">
          <button type="button" @click="goToProfile">Profile</button>
          <button type="button" @click="signOut">Sign out</button>
        </div>
      </div>
    </nav>

    <!-- MAIN -->
    <main class="main-content">
      <div class="welcome-section">
        <p class="welcome-small">Welcome back</p>

        <h1>
          Where are you going,
          <span>{{ userName }}</span>?
        </h1>

        <p class="welcome-description">
          Choose your pickup and destination to get an estimated fare.
        </p>
      </div>

      <section class="ride-card">

        <!-- LEFT PANEL -->
        <div class="ride-panel">

          <div class="panel-header">
            <div>
              <h2>Plan your ride</h2>
              <p>Select your pickup and destination</p>
            </div>

            <div class="location-status">
              <span :class="{ active: pickupLocation }"></span>
              <span :class="{ active: dropoffLocation }"></span>
            </div>
          </div>

          <!-- PICKUP -->
          <div class="location-group">
            <label>Pickup location</label>

            <div class="location-input-row">
              <div class="input-icon pickup-icon">●</div>

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

                <div
                  v-if="pickupFocused && pickupSuggestions.length"
                  class="suggestions"
                >
                  <button
                    v-for="place in pickupSuggestions"
                    :key="place.id"
                    type="button"
                    class="suggestion-item"
                    @mousedown.prevent="selectPickupSuggestion(place)"
                  >
                    <span class="suggestion-icon">⌖</span>

                    <span class="suggestion-text">
                      <strong>{{ place.name }}</strong>
                      <small>{{ place.address }}</small>
                    </span>
                  </button>
                </div>

                <div
                  v-if="pickupFocused && pickupLoading"
                  class="search-loading"
                >
                  Searching...
                </div>
              </div>

              <button
                class="search-btn"
                type="button"
                :disabled="pickupLoading"
                @click="searchPickup"
              >
                {{ pickupLoading ? '...' : 'Search' }}
              </button>
            </div>

            <button
              class="current-btn"
              type="button"
              :disabled="locationLoading"
              @click="useCurrentLocation('pickup')"
            >
              ◎
              {{
                locationLoading && currentLocationTarget === 'pickup'
                  ? 'Locating...'
                  : 'Use current location'
              }}
            </button>
          </div>

          <div class="route-connector">
            <span></span>
          </div>

          <!-- DROPOFF -->
          <div class="location-group">
            <label>Drop-off location</label>

            <div class="location-input-row">
              <div class="input-icon dropoff-icon">●</div>

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

                <div
                  v-if="dropoffFocused && dropoffSuggestions.length"
                  class="suggestions"
                >
                  <button
                    v-for="place in dropoffSuggestions"
                    :key="place.id"
                    type="button"
                    class="suggestion-item"
                    @mousedown.prevent="selectDropoffSuggestion(place)"
                  >
                    <span class="suggestion-icon">⌖</span>

                    <span class="suggestion-text">
                      <strong>{{ place.name }}</strong>
                      <small>{{ place.address }}</small>
                    </span>
                  </button>
                </div>

                <div
                  v-if="dropoffFocused && dropoffLoading"
                  class="search-loading"
                >
                  Searching...
                </div>
              </div>

              <button
                class="search-btn"
                type="button"
                :disabled="dropoffLoading"
                @click="searchDropoff"
              >
                {{ dropoffLoading ? '...' : 'Search' }}
              </button>
            </div>

            <button
              class="current-btn"
              type="button"
              :disabled="locationLoading"
              @click="useCurrentLocation('dropoff')"
            >
              ◎
              {{
                locationLoading && currentLocationTarget === 'dropoff'
                  ? 'Locating...'
                  : 'Use current location'
              }}
            </button>
          </div>

          <!-- MESSAGE -->
          <div
            v-if="locationMessage"
            class="location-message"
            :class="locationMessageType"
          >
            {{ locationMessage }}
          </div>

          <!-- RIDE DETAILS -->
          <div
            v-if="pickupLocation && dropoffLocation"
            class="ride-details"
          >

            <!-- DISTANCE -->
            <div class="distance-card">
              <div>
                <span class="detail-label">Road distance</span>
                <strong>{{ distance }} km</strong>
              </div>

              <div class="distance-meta">
                <span>{{ duration }} min</span>
                <span>•</span>
                <span>Dhaka route</span>
              </div>
            </div>

            <!-- VEHICLES -->
            <div class="vehicle-section">
              <div class="section-title">
                <h3>Choose your vehicle</h3>

                <span>
                  {{
                    fareLoading
                      ? 'Calculating...'
                      : 'Fare by vehicle'
                  }}
                </span>
              </div>

              <div
                v-if="vehiclesLoading"
                class="loading-card"
              >
                Loading available vehicle types...
              </div>

              <div
                v-else-if="vehicles.length === 0"
                class="loading-card error-card"
              >
                No vehicle type is currently available.
              </div>

              <div
                v-else
                class="vehicle-list"
              >
                <button
                  v-for="vehicle in vehicles"
                  :key="vehicle.id || vehicle.type"
                  type="button"
                  class="vehicle-card"
                  :class="{
                    selected: selectedVehicle === vehicle.type
                  }"
                  @click="selectVehicle(vehicle.type)"
                >
                  <div class="vehicle-left">
                    <div class="vehicle-circle">
                      {{ vehicle.icon || '🚗' }}
                    </div>

                    <div class="vehicle-info">
                      <strong>
                        {{ vehicle.name || vehicle.type }}
                      </strong>

                      <span>
                        {{
                          vehicle.description ||
                          'Available vehicle'
                        }}
                      </span>
                    </div>
                  </div>

                  <div class="vehicle-price">
                    {{
                      fareFor(vehicle.type) === null
                        ? '—'
                        : `৳${fareFor(vehicle.type)}`
                    }}
                  </div>
                </button>
              </div>
            </div>

            <!-- COUPON -->
            <div class="coupon-section">
              <h3>Have a coupon?</h3>

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
                :class="couponMessageType"
              >
                {{ couponMessage }}
              </p>
            </div>

            <!-- FARE -->
            <div
              v-if="selectedFare"
              class="fare-summary"
            >
              <div class="fare-line">
                <span>Vehicle</span>
                <span>
                  {{
                    selectedVehicleData?.name ||
                    selectedVehicle
                  }}
                </span>
              </div>

              <div class="fare-line">
                <span>Distance</span>
                <span>{{ distance }} km</span>
              </div>

              <div
                v-if="selectedFare.baseFare != null"
                class="fare-line"
              >
                <span>Base fare</span>
                <span>৳{{ selectedFare.baseFare }}</span>
              </div>

              <div
                v-if="selectedFare.perKm != null"
                class="fare-line"
              >
                <span>Rate</span>
                <span>
                  ৳{{ selectedFare.perKm }}/km
                </span>
              </div>

              <div
                v-if="selectedFare.discount > 0"
                class="fare-line discount"
              >
                <span>Coupon discount</span>
                <span>
                  - ৳{{ selectedFare.discount }}
                </span>
              </div>

              <div class="fare-total">
                <div>
                  <span>Estimated fare</span>
                  <small>
                    Calculated by Rooda server
                  </small>
                </div>

                <strong>
                  ৳{{ selectedFare.fare }}
                </strong>
              </div>
            </div>

            <!-- REQUEST -->
            <button
              class="request-btn"
              type="button"
              :disabled="requestLoading || !selectedFare"
              @click="requestRide"
            >
              <span>
                {{
                  requestLoading
                    ? 'Requesting...'
                    : 'Request Ride'
                }}
              </span>

              <span class="request-arrow">→</span>
            </button>
          </div>

          <!-- HINT -->
          <div
            v-else
            class="ride-hint"
          >
            <div class="hint-icon">✦</div>

            <div>
              <strong>Choose your route</strong>

              <p>
                Search a location, use your current
                location, or click directly on the map.
              </p>
            </div>
          </div>
        </div>

        <!-- MAP -->
        <div class="map-panel">
          <div
            ref="mapContainer"
            class="map"
          ></div>

          <div class="map-top-card">
            <span class="map-live-dot"></span>
            <span>Dhaka service area</span>
          </div>

          <button
            class="map-location-btn"
            type="button"
            @click="
              useCurrentLocation(
                pickupLocation
                  ? 'dropoff'
                  : 'pickup'
              )
            "
          >
            ◎
          </button>

          <div class="map-instruction">
            <span class="map-click-icon">⌖</span>
            <span>
              Click the map to select a location
            </span>
          </div>

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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const router = useRouter()

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

const MAPBOX_TOKEN =
  import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

/* =========================================================
   USER
========================================================= */

const userName = ref(
  localStorage.getItem('user_name') ||
  localStorage.getItem('name') ||
  'User'
)

const userInitial = computed(() =>
  userName.value.charAt(0).toUpperCase()
)

const profileOpen = ref(false)

/* =========================================================
   MAP
========================================================= */

const mapContainer = ref(null)

let map = null
let pickupMarker = null
let dropoffMarker = null

const DHAKA_CENTER = [90.4125, 23.8103]

/*
  This is intentionally a little larger than central Dhaka.
  We validate the actual selected coordinate instead of
  relying on Mapbox's address text.
*/
const DHAKA_BOUNDS = [
  [90.25, 23.65],
  [90.55, 23.95]
]

const isInsideDhaka = (lat, lon) => {
  const [[west, south], [east, north]] = DHAKA_BOUNDS

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

let pickupSearchTimer = null
let dropoffSearchTimer = null

const locationMessage = ref('')
const locationMessageType = ref('success')

let messageTimer = null

/* =========================================================
   RIDE / FARE
========================================================= */

const distance = ref(null)
const duration = ref(null)

const vehicles = ref([])
const vehiclesLoading = ref(false)

const selectedVehicle = ref(null)

const fares = ref({})
const fareLoading = ref(false)

const couponCode = ref('')
const couponMessage = ref('')
const couponMessageType = ref('success')

const requestLoading = ref(false)

/* =========================================================
   CURRENT LOCATION
========================================================= */

const locationLoading = ref(false)
const currentLocationTarget = ref(null)

/* =========================================================
   AUTH
========================================================= */

const token = () => localStorage.getItem('token')

const authHeaders = () => ({
  'Content-Type': 'application/json',

  ...(token()
    ? {
        Authorization: `Bearer ${token()}`
      }
    : {})
})

/* =========================================================
   MESSAGE
========================================================= */

const showMessage = (message, type = 'success') => {
  locationMessage.value = message
  locationMessageType.value = type

  clearTimeout(messageTimer)

  messageTimer = setTimeout(() => {
    locationMessage.value = ''
  }, 3500)
}

/* =========================================================
   MAPBOX FORWARD SEARCH
========================================================= */

/*
  IMPORTANT:

  Do NOT filter the returned results by the text
  "Dhaka".

  We validate latitude/longitude instead.

  This allows:
  BUET
  Dhanmondi
  Gulshan
  Bashundhara City
  Hospitals
  Universities
  Restaurants
  etc.

  to work normally.
*/

const mapboxSearch = async (query) => {
  if (!MAPBOX_TOKEN) {
    throw new Error('Mapbox token is missing')
  }

  const q = query.trim()

  if (q.length < 2) {
    return []
  }

  const url = new URL(
    'https://api.mapbox.com/search/geocode/v6/forward'
  )

  url.searchParams.set('q', q)

  /*
    Search around Dhaka.
    This does NOT reject a result merely because
    its address text doesn't contain "Dhaka".
  */
  url.searchParams.set(
    'bbox',
    '90.25,23.65,90.55,23.95'
  )

  url.searchParams.set(
    'proximity',
    `${DHAKA_CENTER[0]},${DHAKA_CENTER[1]}`
  )

  url.searchParams.set(
    'types',
    'poi,address,street,neighborhood,locality,place'
  )

  url.searchParams.set('autocomplete', 'true')
  url.searchParams.set('limit', '10')
  url.searchParams.set('language', 'en')
  url.searchParams.set('access_token', MAPBOX_TOKEN)

  const response = await fetch(url)

  if (!response.ok) {
    const text = await response.text()
    console.error('Mapbox search error:', text)

    throw new Error('Mapbox search failed')
  }

  const data = await response.json()

  const features = data.features || []

  /*
    Coordinate validation ONLY.
  */
  return features
    .map(feature => {
      const coordinates =
        feature.geometry?.coordinates

      if (
        !coordinates ||
        coordinates.length < 2
      ) {
        return null
      }

      const lon = Number(coordinates[0])
      const lat = Number(coordinates[1])

      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return null
      }

      return {
        id: feature.id,

        name:
          feature.properties?.name ||
          feature.text ||
          'Selected location',

        address:
          feature.properties?.full_address ||
          feature.properties?.place_formatted ||
          feature.place_name ||
          '',

        lat,
        lon,

        featureType:
          feature.properties?.feature_type ||
          feature.place_type?.[0] ||
          ''
      }
    })
    .filter(Boolean)
    .filter(place =>
      isInsideDhaka(place.lat, place.lon)
    )
}

/* =========================================================
   REVERSE GEOCODING
========================================================= */

/*
  Reverse geocoding was previously returning things like:

      1100

  because Mapbox sometimes chooses a postcode/address
  feature.

  We now try to find the most meaningful feature.
*/

const reverseGeocode = async (lat, lon) => {
  if (!MAPBOX_TOKEN) {
    return {
      name: 'Selected location',
      address: `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
      lat,
      lon
    }
  }

  const url = new URL(
    'https://api.mapbox.com/search/geocode/v6/reverse'
  )

  url.searchParams.set(
    'longitude',
    lon
  )

  url.searchParams.set(
    'latitude',
    lat
  )

  /*
    Request several possible feature types.
  */
  url.searchParams.set(
    'types',
    'poi,address,street,neighborhood,locality,place'
  )

  url.searchParams.set('limit', '10')
  url.searchParams.set('language', 'en')
  url.searchParams.set(
    'access_token',
    MAPBOX_TOKEN
  )

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Reverse geocoding failed')
  }

  const data = await response.json()

  const features = data.features || []

  /*
    First preference:
    POI / named place
  */

  let selected = features.find(feature => {
    const type =
      feature.properties?.feature_type ||
      feature.place_type?.[0]

    const name =
      feature.properties?.name ||
      feature.text ||
      ''

    return (
      type === 'poi' &&
      name &&
      !/^\d+$/.test(name.trim())
    )
  })

  /*
    Second preference:
    neighborhood/locality/place
  */

  if (!selected) {
    selected = features.find(feature => {
      const type =
        feature.properties?.feature_type ||
        feature.place_type?.[0]

      const name =
        feature.properties?.name ||
        feature.text ||
        ''

      return (
        ['neighborhood', 'locality', 'place'].includes(type) &&
        name &&
        !/^\d+$/.test(name.trim())
      )
    })
  }

  /*
    Third preference:
    address, but don't use a pure number as name.
  */

  if (!selected) {
    selected = features.find(feature => {
      const name =
        feature.properties?.name ||
        feature.text ||
        ''

      return (
        name &&
        !/^\d+$/.test(name.trim())
      )
    })
  }

  /*
    Last fallback.
  */

  if (!selected) {
    selected = features[0]
  }

  if (!selected) {
    return {
      name: 'Selected location',
      address: `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
      lat,
      lon
    }
  }

  const rawName =
    selected.properties?.name ||
    selected.text ||
    ''

  const fullAddress =
    selected.properties?.full_address ||
    selected.properties?.place_formatted ||
    selected.place_name ||
    ''

  const cleanName =
    rawName &&
    !/^\d+$/.test(rawName.trim())
      ? rawName
      : 'Selected location'

  return {
    name: cleanName,
    address:
      fullAddress ||
      `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
    lat,
    lon
  }
}

/* =========================================================
   MARKERS
========================================================= */

/*
  NO "P"
  NO "D"

  Just simple colored dots.
*/

const createMarker = type => {
  const el = document.createElement('div')

  el.className =
    type === 'pickup'
      ? 'custom-marker pickup'
      : 'custom-marker dropoff'

  return el
}

const setMarker = (type, location) => {
  if (!map) return

  if (type === 'pickup' && pickupMarker) {
    pickupMarker.remove()
  }

  if (type === 'dropoff' && dropoffMarker) {
    dropoffMarker.remove()
  }

  const marker = new mapboxgl.Marker({
    element: createMarker(type),
    draggable: true,
    anchor: 'center'
  })
    .setLngLat([
      location.lon,
      location.lat
    ])
    .addTo(map)

  marker.on('dragend', () => {
    handleMarkerDrag(type, marker)
  })

  if (type === 'pickup') {
    pickupMarker = marker
  } else {
    dropoffMarker = marker
  }
}

/* =========================================================
   MARKER DRAG
========================================================= */

const handleMarkerDrag = async (type, marker) => {
  const { lng, lat } = marker.getLngLat()

  if (!isInsideDhaka(lat, lng)) {
    showMessage(
      'Please keep the location inside Dhaka.',
      'error'
    )

    const oldLocation =
      type === 'pickup'
        ? pickupLocation.value
        : dropoffLocation.value

    if (oldLocation) {
      marker.setLngLat([
        oldLocation.lon,
        oldLocation.lat
      ])
    }

    return
  }

  try {
    const place =
      await reverseGeocode(lat, lng)

    if (type === 'pickup') {
      pickupLocation.value = place
      pickupQuery.value = place.name
    } else {
      dropoffLocation.value = place
      dropoffQuery.value = place.name
    }

    await refreshRouteAndFare()

  } catch (error) {
    console.error(error)

    showMessage(
      'Could not update the selected location.',
      'error'
    )
  }
}

/* =========================================================
   SELECT LOCATION
========================================================= */

const selectLocation = async (place, type) => {
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
    pickupLocation.value = place

    pickupQuery.value =
      place.name || 'Selected location'

    pickupSuggestions.value = []
    pickupFocused.value = false

    setMarker('pickup', place)

  } else {
    dropoffLocation.value = place

    dropoffQuery.value =
      place.name || 'Selected location'

    dropoffSuggestions.value = []
    dropoffFocused.value = false

    setMarker('dropoff', place)
  }

  if (map) {
    map.flyTo({
      center: [
        place.lon,
        place.lat
      ],
      zoom: 14,
      duration: 600
    })
  }

  /*
    Only calculate after both locations exist.
  */

  if (
    pickupLocation.value &&
    dropoffLocation.value
  ) {
    await refreshRouteAndFare()
  }
}

const selectPickupSuggestion =
  place =>
    selectLocation(place, 'pickup')

const selectDropoffSuggestion =
  place =>
    selectLocation(place, 'dropoff')

/* =========================================================
   PICKUP SEARCH
========================================================= */

const handlePickupInput = () => {
  pickupLocation.value = null

  if (pickupMarker) {
    pickupMarker.remove()
    pickupMarker = null
  }

  pickupSuggestions.value = []

  clearTimeout(pickupSearchTimer)

  const query =
    pickupQuery.value.trim()

  if (query.length < 2) {
    pickupFocused.value = false
    return
  }

  pickupFocused.value = true

  pickupSearchTimer = setTimeout(
    async () => {
      pickupLoading.value = true

      try {
        pickupSuggestions.value =
          await mapboxSearch(query)

      } catch (error) {
        console.error(error)

        showMessage(
          'Location search failed.',
          'error'
        )

      } finally {
        pickupLoading.value = false
      }
    },
    250
  )
}

/* =========================================================
   DROPOFF SEARCH
========================================================= */

const handleDropoffInput = () => {
  dropoffLocation.value = null

  if (dropoffMarker) {
    dropoffMarker.remove()
    dropoffMarker = null
  }

  dropoffSuggestions.value = []

  clearTimeout(dropoffSearchTimer)

  const query =
    dropoffQuery.value.trim()

  if (query.length < 2) {
    dropoffFocused.value = false
    return
  }

  dropoffFocused.value = true

  dropoffSearchTimer = setTimeout(
    async () => {
      dropoffLoading.value = true

      try {
        dropoffSuggestions.value =
          await mapboxSearch(query)

      } catch (error) {
        console.error(error)

        showMessage(
          'Location search failed.',
          'error'
        )

      } finally {
        dropoffLoading.value = false
      }
    },
    250
  )
}

/* =========================================================
   SEARCH BUTTONS
========================================================= */

const searchPickup = async () => {
  const query =
    pickupQuery.value.trim()

  if (query.length < 2) {
    showMessage(
      'Please enter a pickup location.',
      'error'
    )

    return
  }

  pickupLoading.value = true

  try {
    const results =
      await mapboxSearch(query)

    if (!results.length) {
      showMessage(
        'No matching location found inside Dhaka.',
        'error'
      )

      return
    }

    await selectLocation(
      results[0],
      'pickup'
    )

  } catch (error) {
    console.error(error)

    showMessage(
      'Location search failed.',
      'error'
    )

  } finally {
    pickupLoading.value = false
  }
}

const searchDropoff = async () => {
  const query =
    dropoffQuery.value.trim()

  if (query.length < 2) {
    showMessage(
      'Please enter a drop-off location.',
      'error'
    )

    return
  }

  dropoffLoading.value = true

  try {
    const results =
      await mapboxSearch(query)

    if (!results.length) {
      showMessage(
        'No matching location found inside Dhaka.',
        'error'
      )

      return
    }

    await selectLocation(
      results[0],
      'dropoff'
    )

  } catch (error) {
    console.error(error)

    showMessage(
      'Location search failed.',
      'error'
    )

  } finally {
    dropoffLoading.value = false
  }
}

/* =========================================================
   CURRENT LOCATION
========================================================= */

const useCurrentLocation = type => {
  if (!navigator.geolocation) {
    showMessage(
      'Your browser does not support location services.',
      'error'
    )

    return
  }

  locationLoading.value = true
  currentLocationTarget.value = type

  navigator.geolocation.getCurrentPosition(
    async position => {
      const lat =
        position.coords.latitude

      const lon =
        position.coords.longitude

      locationLoading.value = false
      currentLocationTarget.value = null

      if (!isInsideDhaka(lat, lon)) {
        showMessage(
          'Your current location is outside Dhaka.',
          'error'
        )

        return
      }

      try {
        const place =
          await reverseGeocode(lat, lon)

        await selectLocation(
          place,
          type
        )

        showMessage(
          `${type === 'pickup' ? 'Pickup' : 'Drop-off'} set to your current location.`,
          'success'
        )

      } catch (error) {
        console.error(error)

        showMessage(
          'Could not read your current location.',
          'error'
        )
      }
    },

    error => {
      locationLoading.value = false
      currentLocationTarget.value = null

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
   MAP CLICK
========================================================= */

const handleMapClick = async event => {
  const lat =
    event.lngLat.lat

  const lon =
    event.lngLat.lng

  /*
    IMPORTANT:
    We validate coordinates only.
  */

  if (!isInsideDhaka(lat, lon)) {
    showMessage(
      'Please select a location inside Dhaka.',
      'error'
    )

    return
  }

  /*
    First click = pickup
    Second click = dropoff
    Third click = replace pickup
  */

  let type

  if (!pickupLocation.value) {
    type = 'pickup'
  } else if (!dropoffLocation.value) {
    type = 'dropoff'
  } else {
    type = 'pickup'
  }

  try {
    const place =
      await reverseGeocode(lat, lon)

    await selectLocation(
      place,
      type
    )

    showMessage(
      `${type === 'pickup' ? 'Pickup' : 'Drop-off'} selected from map.`,
      'success'
    )

  } catch (error) {
    console.error(error)

    /*
      Even if reverse geocoding fails,
      the map click should STILL work.
    */

    const fallback = {
      name: 'Selected location',
      address: `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
      lat,
      lon
    }

    await selectLocation(
      fallback,
      type
    )
  }
}

/* =========================================================
   ROUTE
========================================================= */

const drawRoute = async () => {
  if (
    !map ||
    !pickupLocation.value ||
    !dropoffLocation.value ||
    !MAPBOX_TOKEN
  ) {
    return
  }

  const coordinates =
    `${pickupLocation.value.lon},${pickupLocation.value.lat};` +
    `${dropoffLocation.value.lon},${dropoffLocation.value.lat}`

  const url = new URL(
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
      'Route request failed'
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
      (route.distance / 1000)
        .toFixed(2)
    )

  duration.value =
    Math.max(
      1,
      Math.round(
        route.duration / 60
      )
    )

  const geojson = {
    type: 'Feature',
    properties: {},
    geometry: route.geometry
  }

  if (map.getSource('route')) {
    map
      .getSource('route')
      .setData(geojson)

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
        'line-cap': 'round',
        'line-join': 'round'
      },

      paint: {
        'line-color': '#20df4f',
        'line-width': 5,
        'line-opacity': 0.9
      }
    })
  }

  const bounds =
    new mapboxgl.LngLatBounds()

  route.geometry.coordinates.forEach(
    coordinate => {
      bounds.extend(coordinate)
    }
  )

  map.fitBounds(
    bounds,
    {
      padding: 70,
      duration: 700
    }
  )
}

/* =========================================================
   VEHICLES
========================================================= */

const normalizeVehicle = vehicle => ({
  id:
    vehicle.id ??
    vehicle.vehicle_id ??
    vehicle.type,

  type:
    String(
      vehicle.type ??
      vehicle.vehicle_type ??
      vehicle.name ??
      ''
    ).toUpperCase(),

  name:
    vehicle.displayName ??
    vehicle.display_name ??
    vehicle.name ??
    vehicle.type,

  icon:
    vehicle.icon ??
    vehicle.emoji ??
    '🚗',

  description:
    vehicle.description ??
    ''
})

const loadVehicles = async () => {
  vehiclesLoading.value = true

  try {
    const response =
      await fetch(
        `${API_BASE_URL}/core/vehicles/types`,
        {
          headers: authHeaders()
        }
      )

    if (!response.ok) {
      throw new Error(
        `Vehicle request failed: ${response.status}`
      )
    }

    const data =
      await response.json()

    const list =
      Array.isArray(data)
        ? data
        : (
            data.vehicles ||
            data.vehicleTypes ||
            data.data ||
            []
          )

    vehicles.value =
      list
        .map(normalizeVehicle)
        .filter(
          vehicle => vehicle.type
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
      'Could not load available vehicle types.',
      'error'
    )

  } finally {
    vehiclesLoading.value = false
  }
}

/* =========================================================
   FARE
========================================================= */

/*
  Frontend sends ONLY:

      distance
      couponCode

  Backend returns ALL vehicle fares.
*/

const calculateAllFares = async () => {
  if (
    distance.value === null ||
    distance.value === undefined
  ) {
    return
  }

  fareLoading.value = true

  try {
    const response =
      await fetch(
        `${API_BASE_URL}/core/rides/fare`,
        {
          method: 'POST',
          headers: authHeaders(),

          body: JSON.stringify({
            distance: distance.value,

            couponCode:
              couponCode.value.trim() ||
              null
          })
        }
      )

    if (!response.ok) {
      throw new Error(
        `Fare request failed: ${response.status}`
      )
    }

    const data =
      await response.json()

    const list =
      data.fares ||
      data.data ||
      []

    const fareMap = {}

    list.forEach(fare => {
      const type =
        String(
          fare.vehicleType ??
          fare.type ??
          ''
        ).toUpperCase()

      if (!type) return

      fareMap[type] = {
        fare: Number(
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
    })

    fares.value = fareMap

    if (
      !selectedVehicle.value &&
      vehicles.value.length
    ) {
      selectedVehicle.value =
        vehicles.value[0].type
    }

  } catch (error) {
    console.error(error)

    showMessage(
      'Could not calculate fares from the server.',
      'error'
    )

  } finally {
    fareLoading.value = false
  }
}

const fareFor = type =>
  fares.value[type]?.fare ?? null

const selectedFare = computed(() => {
  if (!selectedVehicle.value) {
    return null
  }

  return (
    fares.value[
      selectedVehicle.value
    ] || null
  )
})

const selectedVehicleData = computed(() =>
  vehicles.value.find(
    vehicle =>
      vehicle.type ===
      selectedVehicle.value
  ) || null
)

const selectVehicle = type => {
  selectedVehicle.value = type
}

/* =========================================================
   COUPON
========================================================= */

const applyCoupon = async () => {
  if (!couponCode.value.trim()) {
    couponMessage.value =
      'Enter a coupon code.'

    couponMessageType.value =
      'error'

    return
  }

  if (!distance.value) {
    couponMessage.value =
      'Select pickup and drop-off first.'

    couponMessageType.value =
      'error'

    return
  }

  couponMessage.value =
    'Recalculating fares...'

  couponMessageType.value =
    'success'

  await calculateAllFares()

  couponMessage.value =
    'Coupon sent to the server for validation.'

  couponMessageType.value =
    'success'
}

/* =========================================================
   ROUTE + FARE
========================================================= */

const refreshRouteAndFare = async () => {
  fares.value = {}

  if (
    !pickupLocation.value ||
    !dropoffLocation.value
  ) {
    distance.value = null
    duration.value = null

    if (
      map &&
      map.getSource('route')
    ) {
      map
        .getSource('route')
        .setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        })
    }

    return
  }

  try {
    await drawRoute()

    /*
      Load vehicle types from DB.
    */
    await loadVehicles()

    /*
      Send distance to backend.
      Backend returns all fares.
    */
    await calculateAllFares()

  } catch (error) {
    console.error(error)

    showMessage(
      'Could not build the route. Please try another location.',
      'error'
    )
  }
}

/* =========================================================
   MAP SELECTION TEXT
========================================================= */

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

/* =========================================================
   INITIALIZE MAP
========================================================= */

const initializeMap = () => {
  if (
    !mapContainer.value ||
    !MAPBOX_TOKEN
  ) {
    console.error(
      'Mapbox token or map container missing'
    )

    return
  }

  mapboxgl.accessToken =
    MAPBOX_TOKEN

  map = new mapboxgl.Map({
    container:
      mapContainer.value,

    style:
      'mapbox://styles/mapbox/streets-v12',

    center:
      DHAKA_CENTER,

    zoom: 12,

    minZoom: 10,

    maxZoom: 18
  })

  map.addControl(
    new mapboxgl.NavigationControl(),
    'top-right'
  )

  /*
    IMPORTANT:

    Do NOT use maxBounds here.

    maxBounds can make the map behave badly around
    the edge of Dhaka and can interfere with selecting
    locations.

    We validate the coordinates ourselves.
  */

  map.on(
    'load',
    () => {
      map.resize()
    }
  )

  /*
    Attach click listener directly to map.
  */
  map.on(
    'click',
    handleMapClick
  )
}

/* =========================================================
   REQUEST RIDE
========================================================= */

const requestRide = async () => {
  if (
    !pickupLocation.value ||
    !dropoffLocation.value ||
    !distance.value ||
    !selectedFare.value
  ) {
    showMessage(
      'Please select a valid route and vehicle first.',
      'error'
    )

    return
  }

  requestLoading.value = true

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
      await response
        .json()
        .catch(() => ({}))

    if (!response.ok) {
      throw new Error(
        data.message ||
        'Ride request failed'
      )
    }

    showMessage(
      data.message ||
      'Ride requested successfully.',
      'success'
    )

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
    requestLoading.value = false
  }
}

/* =========================================================
   PROFILE
========================================================= */

const goToProfile = () => {
  profileOpen.value = false

  router.push('/profile')
}

const signOut = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user_name')
  localStorage.removeItem('name')

  profileOpen.value = false

  router.push('/signin')
}

/* =========================================================
   CLOSE DROPDOWNS
========================================================= */

const closeMenus = event => {
  if (
    !event.target.closest(
      '.profile-area'
    )
  ) {
    profileOpen.value = false
  }

  if (
    !event.target.closest(
      '.search-wrapper'
    )
  ) {
    pickupFocused.value = false
    dropoffFocused.value = false
  }
}

/* =========================================================
   LIFECYCLE
========================================================= */

onMounted(async () => {
  initializeMap()

  document.addEventListener(
    'click',
    closeMenus
  )

  /*
    Vehicle types are loaded initially.
    They will be refreshed after route selection.
  */
  await loadVehicles()
})

onBeforeUnmount(() => {
  map?.remove()

  clearTimeout(
    pickupSearchTimer
  )

  clearTimeout(
    dropoffSearchTimer
  )

  clearTimeout(
    messageTimer
  )

  document.removeEventListener(
    'click',
    closeMenus
  )
})
</script>


<style scoped>

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


/* =========================================================
   PAGE
========================================================= */

.home-page {
  min-height: 100vh;

  color: #111;

  background:
    linear-gradient(
      135deg,
      #ffffff 0%,
      #f7f8f7 48%,
      #e8eee9 100%
    );
}


/* =========================================================
   NAVBAR
========================================================= */

.navbar {
  height: 88px;

  padding: 0 5.5%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom:
    1px solid rgba(17,17,17,.08);

  background:
    rgba(255,255,255,.86);

  backdrop-filter:
    blur(18px);

  position: sticky;

  top: 0;

  z-index: 1000;
}

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

  background: #20df4f;

  border-radius: 50%;
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

.nav-links {
  display: flex;
  align-items: center;
  gap: 34px;
}

.nav-links a {
  color: #4f5551;
  text-decoration: none;
  font-size: 14px;
  transition: .2s;
}

.nav-links a:hover {
  color: #159b36;
}


/* =========================================================
   PROFILE
========================================================= */

.profile-area {
  position: relative;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 9px;

  padding:
    6px 12px 6px 6px;

  border:
    1px solid rgba(17,17,17,.1);

  border-radius: 30px;

  background:
    rgba(255,255,255,.8);

  color: #111;

  cursor: pointer;

  font-size: 13px;
}

.profile-btn:hover {
  border-color:
    rgba(32,223,79,.55);
}

.profile-icon {
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #20df4f;

  color: #111;

  font-weight: 800;
}

.profile-arrow {
  color: #777;
}

.profile-menu {
  position: absolute;

  right: 0;
  top: 48px;

  width: 150px;

  padding: 7px;

  border:
    1px solid rgba(0,0,0,.08);

  border-radius: 14px;

  background: #fff;

  box-shadow:
    0 18px 40px rgba(0,0,0,.12);

  z-index: 1100;
}

.profile-menu button {
  width: 100%;

  padding: 10px;

  border: 0;

  border-radius: 9px;

  background: transparent;

  text-align: left;

  cursor: pointer;

  color: #222;
}

.profile-menu button:hover {
  background: #f1f5f1;
}


/* =========================================================
   MAIN
========================================================= */

.main-content {
  width: 100%;

  max-width: 1450px;

  margin: 0 auto;

  padding:
    55px 5.5% 70px;
}

.welcome-section {
  margin-bottom: 28px;
}

.welcome-small {
  margin:
    0 0 8px;

  color: #149d36;

  font-size: 13px;

  font-weight: 700;

  text-transform:
    uppercase;

  letter-spacing:
    1.5px;
}

.welcome-section h1 {
  margin: 0;

  font-size:
    clamp(32px,4vw,52px);

  line-height: 1.1;

  letter-spacing: -2px;

  font-weight: 650;
}

.welcome-section h1 span {
  color: #149d36;
}

.welcome-description {
  margin:
    12px 0 0;

  color: #68706b;

  font-size: 14px;
}


/* =========================================================
   RIDE CARD
========================================================= */

.ride-card {
  display: grid;

  grid-template-columns:
    minmax(400px,.82fr)
    minmax(500px,1.18fr);

  min-height: 680px;

  border:
    1px solid rgba(17,17,17,.08);

  border-radius: 26px;

  overflow: hidden;

  background:
    rgba(255,255,255,.78);

  box-shadow:
    0 25px 80px
    rgba(30,50,35,.12);
}


/* =========================================================
   LEFT PANEL
========================================================= */

.ride-panel {
  padding: 32px;

  overflow: visible;

  background:
    rgba(255,255,255,.88);
}

.panel-header {
  display: flex;

  justify-content:
    space-between;

  align-items:
    flex-start;

  margin-bottom: 28px;
}

.panel-header h2 {
  margin:
    0 0 5px;

  font-size: 23px;

  font-weight: 650;
}

.panel-header p {
  margin: 0;

  color: #7a817c;

  font-size: 12px;
}

.location-status {
  display: flex;
  gap: 5px;
}

.location-status span {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: #d5dad6;
}

.location-status span.active {
  background: #20df4f;

  box-shadow:
    0 0 10px
    rgba(32,223,79,.5);
}


/* =========================================================
   LOCATION
========================================================= */

.location-group {
  position: relative;
}

.location-group label {
  display: block;

  margin:
    0 0 8px;

  color: #505852;

  font-size: 12px;

  font-weight: 700;
}

.location-input-row {
  display: flex;

  align-items: center;

  gap: 8px;

  width: 100%;
}

.input-icon {
  flex:
    0 0 34px;

  width: 34px;
  height: 34px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  font-size: 13px;
}

.pickup-icon {
  color: #149d36;

  background:
    rgba(32,223,79,.12);
}

.dropoff-icon {
  color: #e44c4c;

  background:
    rgba(255,107,107,.12);
}

.search-wrapper {
  position: relative;

  flex: 1;

  min-width: 0;
}

.search-wrapper input {
  width: 100%;

  height: 50px;

  padding:
    0 15px;

  border:
    1px solid rgba(17,17,17,.11);

  border-radius: 11px;

  outline: none;

  background:
    rgba(255,255,255,.85);

  color: #111;

  font-size: 13px;

  transition: .2s;
}

.search-wrapper input:focus {
  border-color:
    rgba(32,160,65,.55);

  box-shadow:
    0 0 0 3px
    rgba(32,223,79,.08);
}

.search-wrapper input::placeholder {
  color: #9aa19c;
}


/* =========================================================
   SEARCH
========================================================= */

.search-btn {
  flex:
    0 0 68px;

  height: 50px;

  border: 0;

  border-radius: 11px;

  background:
    rgba(32,223,79,.12);

  color: #159b36;

  font-size: 11px;

  font-weight: 700;

  cursor: pointer;
}

.search-btn:hover:not(:disabled) {
  background: #20df4f;
  color: #111;
}

.search-btn:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.search-loading {
  position: absolute;

  top:
    calc(100% + 6px);

  left: 0;
  right: 0;

  z-index: 101;

  padding: 13px;

  border:
    1px solid rgba(0,0,0,.08);

  border-radius: 12px;

  background: #fff;

  box-shadow:
    0 18px 45px
    rgba(0,0,0,.12);

  color: #777;

  font-size: 11px;
}

.current-btn {
  margin:
    8px 0 0 42px;

  padding: 0;

  border: 0;

  background: transparent;

  color: #159b36;

  font-size: 11px;

  font-weight: 650;

  cursor: pointer;
}

.current-btn:disabled {
  opacity: .5;
}


/* =========================================================
   SUGGESTIONS
========================================================= */

.suggestions {
  position: absolute;

  left: 0;
  right: 0;

  top:
    calc(100% + 6px);

  z-index: 100;

  overflow: hidden;

  border:
    1px solid rgba(0,0,0,.1);

  border-radius: 13px;

  background: #fff;

  box-shadow:
    0 18px 45px
    rgba(0,0,0,.15);
}

.suggestion-item {
  width: 100%;

  display: flex;

  align-items: center;

  gap: 10px;

  padding: 12px;

  border: 0;

  border-bottom:
    1px solid #f0f1f0;

  background: #fff;

  color: #111;

  text-align: left;

  cursor: pointer;
}

.suggestion-item:hover {
  background: #f2f8f3;
}

.suggestion-icon {
  width: 30px;
  height: 30px;

  flex:
    0 0 30px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background:
    rgba(32,223,79,.1);

  color: #159b36;
}

.suggestion-text {
  min-width: 0;
}

.suggestion-text strong,
.suggestion-text small {
  display: block;

  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;
}

.suggestion-text strong {
  font-size: 12px;
}

.suggestion-text small {
  margin-top: 3px;

  color: #8a928c;

  font-size: 10px;
}


/* =========================================================
   ROUTE
========================================================= */

.route-connector {
  height: 23px;

  margin-left: 17px;

  border-left:
    1px dashed #c9ceca;
}


/* =========================================================
   MESSAGES
========================================================= */

.location-message {
  margin-top: 14px;

  padding:
    10px 13px;

  border-radius: 10px;

  font-size: 11px;
}

.location-message.success {
  background:
    rgba(32,223,79,.08);

  color: #159b36;
}

.location-message.error {
  background:
    rgba(255,92,92,.08);

  color: #d64444;
}


/* =========================================================
   RIDE DETAILS
========================================================= */

.ride-details {
  margin-top: 22px;
}

.distance-card {
  display: flex;

  align-items: center;

  justify-content:
    space-between;

  padding:
    16px 18px;

  border:
    1px solid rgba(17,17,17,.08);

  border-radius: 14px;

  background: #f7faf7;
}

.detail-label {
  display: block;

  color: #747b76;

  font-size: 11px;

  margin-bottom: 5px;
}

.distance-card strong {
  font-size: 24px;
}

.distance-meta {
  display: flex;

  gap: 7px;

  color: #657069;

  font-size: 11px;
}


/* =========================================================
   VEHICLES
========================================================= */

.vehicle-section {
  margin-top: 22px;
}

.section-title {
  display: flex;

  justify-content:
    space-between;

  align-items: center;

  margin-bottom: 10px;
}

.section-title h3,
.coupon-section h3 {
  margin: 0;

  font-size: 13px;
}

.section-title span {
  font-size: 10px;
  color: #858c87;
}

.vehicle-list {
  display: grid;

  gap: 8px;
}

.vehicle-card {
  width: 100%;

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  padding:
    11px 13px;

  border:
    1px solid rgba(17,17,17,.09);

  border-radius: 13px;

  background: #fff;

  color: #111;

  cursor: pointer;

  text-align: left;

  transition: .18s;
}

.vehicle-card:hover {
  border-color:
    rgba(32,160,65,.4);

  transform:
    translateY(-1px);
}

.vehicle-card.selected {
  border-color:
    #20df4f;

  background:
    #f1fff3;

  box-shadow:
    0 0 0 2px
    rgba(32,223,79,.08);
}

.vehicle-left {
  display: flex;

  align-items: center;

  gap: 10px;
}

.vehicle-circle {
  width: 38px;
  height: 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 11px;

  background: #eef3ef;

  font-size: 18px;
}

.vehicle-info strong {
  display: block;

  font-size: 12px;
}

.vehicle-info span {
  display: block;

  margin-top: 3px;

  color: #8a918c;

  font-size: 10px;
}

.vehicle-price {
  font-size: 17px;

  font-weight: 750;
}


/* =========================================================
   LOADING
========================================================= */

.loading-card {
  padding: 15px;

  border-radius: 12px;

  background: #f4f6f4;

  color: #69716c;

  font-size: 11px;
}

.error-card {
  color: #c94343;

  background: #fff2f2;
}


/* =========================================================
   COUPON
========================================================= */

.coupon-section {
  margin-top: 18px;
}

.coupon-row {
  display: flex;

  gap: 8px;

  margin-top: 8px;
}

.coupon-row input {
  flex: 1;

  height: 40px;

  padding:
    0 12px;

  border:
    1px solid rgba(17,17,17,.1);

  border-radius: 9px;

  outline: none;

  background: #fff;
}

.coupon-row button {
  padding:
    0 16px;

  border: 0;

  border-radius: 9px;

  background: #eaf5ec;

  color: #159b36;

  font-weight: 700;

  cursor: pointer;
}

.coupon-message {
  margin:
    6px 0 0;

  font-size: 10px;
}

.coupon-message.error {
  color: #d64444;
}

.coupon-message.success {
  color: #159b36;
}


/* =========================================================
   FARE
========================================================= */

.fare-summary {
  margin-top: 18px;

  padding: 15px;

  border-radius: 14px;

  background: #f7f9f7;

  border:
    1px solid rgba(17,17,17,.07);
}

.fare-line {
  display: flex;

  justify-content:
    space-between;

  padding: 5px 0;

  color: #68716b;

  font-size: 11px;
}

.fare-line.discount {
  color: #159b36;
}

.fare-total {
  display: flex;

  align-items: center;

  justify-content:
    space-between;

  margin-top: 8px;

  padding-top: 12px;

  border-top:
    1px solid #dfe4df;
}

.fare-total span {
  display: block;

  font-size: 12px;

  font-weight: 700;
}

.fare-total small {
  display: block;

  margin-top: 3px;

  color: #929992;

  font-size: 9px;
}

.fare-total strong {
  font-size: 25px;
}


/* =========================================================
   REQUEST
========================================================= */

.request-btn {
  width: 100%;

  height: 52px;

  margin-top: 13px;

  display: flex;

  align-items: center;

  justify-content:
    space-between;

  padding:
    0 18px;

  border: 0;

  border-radius: 12px;

  background: #20df4f;

  color: #111;

  font-size: 13px;

  font-weight: 800;

  cursor: pointer;
}

.request-btn:hover:not(:disabled) {
  background: #16c943;
}

.request-btn:disabled {
  opacity: .5;

  cursor: not-allowed;
}

.request-arrow {
  font-size: 22px;
}


/* =========================================================
   HINT
========================================================= */

.ride-hint {
  display: flex;

  gap: 14px;

  align-items: center;

  margin-top: 25px;

  padding: 18px;

  border:
    1px dashed #ccd2cd;

  border-radius: 14px;

  background: #f7f9f7;
}

.hint-icon {
  width: 38px;
  height: 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 11px;

  background: #eaf7ec;

  color: #159b36;
}

.ride-hint strong {
  font-size: 12px;
}

.ride-hint p {
  margin:
    5px 0 0;

  color: #7f8781;

  font-size: 11px;

  line-height: 1.5;
}


/* =========================================================
   MAP
========================================================= */

.map-panel {
  position: relative;

  min-height: 650px;

  background: #dce5de;
}

.map {
  position: absolute;

  inset: 0;
}

.map-top-card {
  position: absolute;

  top: 18px;
  left: 18px;

  display: flex;

  align-items: center;

  gap: 8px;

  padding:
    9px 12px;

  border:
    1px solid rgba(0,0,0,.08);

  border-radius: 20px;

  background:
    rgba(255,255,255,.9);

  box-shadow:
    0 8px 25px
    rgba(0,0,0,.1);

  font-size: 11px;

  font-weight: 700;
}

.map-live-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #20df4f;

  box-shadow:
    0 0 8px #20df4f;
}

.map-location-btn {
  position: absolute;

  right: 18px;
  top: 68px;

  width: 38px;
  height: 38px;

  border:
    1px solid rgba(0,0,0,.1);

  border-radius: 10px;

  background: #fff;

  box-shadow:
    0 8px 25px
    rgba(0,0,0,.1);

  cursor: pointer;

  font-size: 18px;
}

.map-instruction {
  position: absolute;

  bottom: 18px;
  left: 18px;

  display: flex;

  align-items: center;

  gap: 8px;

  padding:
    9px 12px;

  border-radius: 18px;

  background:
    rgba(255,255,255,.9);

  font-size: 10px;

  color: #555;

  box-shadow:
    0 8px 25px
    rgba(0,0,0,.1);
}

.map-click-icon {
  color: #159b36;
}

.map-selection {
  position: absolute;

  right: 18px;
  bottom: 18px;

  padding:
    9px 12px;

  border-radius: 18px;

  background: #111;

  color: #fff;

  font-size: 10px;
}


/* =========================================================
   MAP MARKERS
========================================================= */

/*
 * IMPORTANT:
 *
 * NO P
 * NO D
 *
 * Just circles.
 */

.custom-marker {
  width: 30px;
  height: 30px;

  border-radius: 50%;

  border:
    4px solid #fff;

  box-shadow:
    0 3px 12px
    rgba(0,0,0,.35);

  cursor: grab;
}

.custom-marker:active {
  cursor: grabbing;
}

.custom-marker.pickup {
  background: #20df4f;
}

.custom-marker.dropoff {
  background: #ff4f5f;
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width:1050px) {

  .nav-links {
    display: none;
  }

  .ride-card {
    grid-template-columns:
      1fr;
  }

  .map-panel {
    min-height: 500px;
  }

  .ride-panel {
    order: 1;
  }

  .map-panel {
    order: 0;
  }
}


@media (max-width:650px) {

  .navbar {
    height: 72px;

    padding:
      0 20px;
  }

  .logo-text {
    font-size: 26px;
  }

  .profile-btn > span:nth-child(2) {
    display: none;
  }

  .main-content {
    padding:
      35px 16px 50px;
  }

  .ride-panel {
    padding: 20px;
  }

  .ride-card {
    border-radius: 18px;
  }

  .location-input-row {
    align-items: stretch;
  }

  .input-icon {
    margin-top: 8px;
  }

  .search-btn {
    flex-basis: 62px;
  }

  .distance-card {
    align-items:
      flex-start;

    gap: 10px;
  }

  .distance-meta {
    flex-direction:
      column;

    align-items:
      flex-end;

    gap: 2px;
  }

  .map-panel {
    min-height: 430px;
  }
}

</style>