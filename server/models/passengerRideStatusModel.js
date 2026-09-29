/*
 * passengerRideStatusModel.js
 *
 * Handles database operations required for
 * passenger ride-status long polling.
 *
 * The client does not provide passenger_id.
 *
 * The passenger is identified using the email
 * stored in the JWT.
 */

const pool =
    require("../config/dbConfig");

/*
 * Find the passenger associated with
 * the authenticated user's email.
 */
async function findPassengerByEmail(
    email
) {
    const query = `
        SELECT
            p.passenger_id
        FROM users u
        INNER JOIN passengers p
            ON p.passenger_id = u.user_id
        WHERE u.email = $1
    `;

    const result =
        await pool.query(
            query,
            [email]
        );

    if (
        result.rows.length === 0
    ) {
        return null;
    }

    return result.rows[0];
}

/*
 * Verify that the ride request belongs
 * to this passenger.
 */
async function findPassengerRideRequest(
    passengerId,
    reqId
) {
    const query = `
        SELECT
            req_id,
            passenger_id
        FROM ride_requests
        WHERE req_id = $1
          AND passenger_id = $2
    `;

    const result =
        await pool.query(
            query,
            [
                reqId,
                passengerId
            ]
        );

    if (
        result.rows.length === 0
    ) {
        return null;
    }

    return result.rows[0];
}

module.exports = {
    findPassengerByEmail,
    findPassengerRideRequest
};  