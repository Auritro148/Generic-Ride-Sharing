/*
 * confirmRideRequest.js
 *
 * Handles database operation for accepting
 * a ride request.
 *
 * The stored procedure:
 * create_trip_from_request()
 *
 * creates the trip and removes the original
 * ride request after successful acceptance.
 */

const pool = require("../config/dbConfig");

async function confirmRideRequest(
    driverId,
    reqId
) {
    const query = `
        CALL create_trip_from_request(
            $1,
            $2
        )
    `;

    await pool.query(
        query,
        [
            driverId,
            reqId
        ]
    );

    return true;
}

module.exports = {
    confirmRideRequest
};