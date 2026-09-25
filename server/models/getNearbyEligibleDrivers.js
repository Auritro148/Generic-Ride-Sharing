/*
 * getNearbyEligibleDrivers.js
 *
 * Finds drivers who are eligible for a specific
 * ride request.
 *
 * Current eligibility rules:
 *
 * 1. Driver must be online.
 * 2. Driver must have an active location.
 * 3. Driver's vehicle must match the vehicle_type_id
 *    requested by the ride request.
 * 4. Driver must be inside the configured radius
 *    from the pickup location.
 *
 *
 * Vehicle eligibility:
 *
 * ride_requests.vehicle_type_id
 *          ↓
 * vehicles.vehicle_type_id
 *
 * drivers.active_vehicle_id is NOT used to determine
 * vehicle eligibility.
 *
 *
 * Distance:
 *
 * PostGIS geography is constructed from the existing
 * latitude/longitude columns.
 *
 * Coordinates are passed as:
 *
 * longitude, latitude
 *
 * because ST_MakePoint() expects X, Y.
 */


const pool = require("../config/dbConfig");

const {
    DRIVER_SEARCH_RADIUS_METERS
} = require("../config/driverSearchConfig");


async function getNearbyEligibleDrivers(reqId) {

    const query = `
        SELECT
            d.driver_id,

            adl.lat,
            adl.long,

            adl.updated_at,

            ST_Distance(
                ST_SetSRID(
                    ST_MakePoint(
                        adl.long::double precision,
                        adl.lat::double precision
                    ),
                    4326
                )::geography,

                ST_SetSRID(
                    ST_MakePoint(
                        rrl.pickup_long,
                        rrl.pickup_lat
                    ),
                    4326
                )::geography

            ) AS distance_meters

        FROM public.ride_requests rr

        INNER JOIN public.ride_request_location rrl
            ON rrl.req_id = rr.req_id

        INNER JOIN public.drivers d
            ON d.is_online = true

        INNER JOIN public.active_driver_location adl
            ON adl.driver_id = d.driver_id

        WHERE rr.req_id = $1

          AND EXISTS (

              SELECT 1

              FROM public.vehicles v

              WHERE v.driver_id = d.driver_id
                AND v.vehicle_type_id = rr.vehicle_type_id

          )

          AND ST_DWithin(

              ST_SetSRID(
                  ST_MakePoint(
                      adl.long::double precision,
                      adl.lat::double precision
                  ),
                  4326
              )::geography,

              ST_SetSRID(
                  ST_MakePoint(
                      rrl.pickup_long,
                      rrl.pickup_lat
                  ),
                  4326
              )::geography,

              $2

          )

        ORDER BY distance_meters ASC
    `;


    const result = await pool.query(
        query,
        [
            reqId,
            DRIVER_SEARCH_RADIUS_METERS
        ]
    );


    return result.rows;
}


module.exports = {
    getNearbyEligibleDrivers
};