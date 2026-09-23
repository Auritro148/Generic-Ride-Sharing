/*
 * rideRequestModel.js
 *
 * Database interface for ride requests.
 *
 * The controller should not contain SQL queries.
 * Database operations are implemented here.
 */

const pool = require("../config/dbConfig");


// ---------------------------------------------
// Find passenger by user email
// ---------------------------------------------
//
// The email comes from the authenticated JWT.
//
// users.user_id
//      ↓
// passengers.passenger_id
//
// @param {string} email
// @returns {Object|null}
//
async function findPassengerByEmail(email) {

    const query = `
        SELECT
            p.passenger_id
        FROM public.passengers p
        INNER JOIN public.users u
            ON p.passenger_id = u.user_id
        WHERE u.email = $1
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}


// ---------------------------------------------
// Find vehicle type
// ---------------------------------------------
//
// vehicleType from the client corresponds to
// vehicle_types.model_name.
//
// Matching is case-insensitive.
//
// @param {string} vehicleType
// @returns {Object|null}
//
async function findVehicleType(vehicleType) {

    const query = `
        SELECT
            type_id,
            model_name,
            capacity
        FROM public.vehicle_types
        WHERE LOWER(model_name) = LOWER($1)
    `;

    const result = await pool.query(query, [vehicleType]);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}


// ---------------------------------------------
// Create ride request
// ---------------------------------------------
//
// Creates both:
//
// 1. ride_requests
// 2. ride_request_location
//
// Both operations happen inside the same
// PostgreSQL transaction.
//
// @param {Object} requestData
// @returns {Object}
//
async function createRideRequest(requestData) {

   const {
    passenger_id,
    seats,
    vehicle_type_id,
    est_fare
} = requestData;


    const client = await pool.connect();

    try {

        await client.query("BEGIN");


        // -----------------------------------------
        // Create ride request
        // -----------------------------------------

        const requestQuery = `
            INSERT INTO public.ride_requests (
                passenger_id,
                seats,
                vehicle_type_id,
                est_fare
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const requestValues = [
            passenger_id,
            seats,
            vehicle_type_id,
            est_fare
        ];

        const requestResult = await client.query(
            requestQuery,
            requestValues
        );

        const rideRequest = requestResult.rows[0];


        // -----------------------------------------
        // Create request location
        // -----------------------------------------

        const locationQuery = `
            INSERT INTO public.ride_request_location (
                req_id,
                pickup_lat,
                pickup_long,
                drop_lat,
                drop_long,
                pick_addr,
                drop_addr,
                pick_name,
                drop_name
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;

        const locationValues = [
            rideRequest.req_id,
            requestData.pickup.latitude,
            requestData.pickup.longitude,
            requestData.dropoff.latitude,
            requestData.dropoff.longitude,
            requestData.pickup.address,
            requestData.dropoff.address,
            requestData.pickup.name,
            requestData.dropoff.name
        ];

        const locationResult = await client.query(
            locationQuery,
            locationValues
        );


        await client.query("COMMIT");


        return {
            request: rideRequest,
            location: locationResult.rows[0]
        };


    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
}


module.exports = {
    findPassengerByEmail,
    findVehicleType,
    createRideRequest
};