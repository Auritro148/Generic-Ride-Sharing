/*
 * updatePassengerLocation.js
 *
 * Handles database operations for the
 * authenticated passenger's active location.
 *
 * The client does NOT provide passenger_id.
 *
 * The authenticated user's email is obtained
 * from the JWT and used to find the passenger_id.
 *
 * Database logic is kept inside this model.
 */

const pool = require("../config/dbConfig");


/*
 * Finds the passenger associated with an email.
 *
 * users.user_id
 *      ↓
 * passengers.passenger_id
 */
async function findPassengerByEmail(email) {

    const query = `
        SELECT
            u.user_id,
            u.email,
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

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}


/*
 * Inserts or updates the passenger's
 * active location.
 *
 * active_passenger_location has a UNIQUE
 * constraint on passenger_id, therefore
 * ON CONFLICT (passenger_id) updates the
 * existing location instead of creating
 * another row.
 */
async function updatePassengerLocation(
    passengerId,
    lat,
    long
) {

    const query = `
        INSERT INTO active_passenger_location (
            passenger_id,
            lat,
            long,
            updated_at
        )
        VALUES (
            $1,
            $2,
            $3,
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (passenger_id)
        DO UPDATE SET
            lat = EXCLUDED.lat,
            long = EXCLUDED.long,
            updated_at = CURRENT_TIMESTAMP
        RETURNING
            active_location_id,
            passenger_id,
            lat,
            long,
            updated_at
    `;

    const result =
        await pool.query(
            query,
            [
                passengerId,
                lat,
                long
            ]
        );

    return result.rows[0];
}


module.exports = {
    findPassengerByEmail,
    updatePassengerLocation
};