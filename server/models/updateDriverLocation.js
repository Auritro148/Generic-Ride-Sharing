/*
 * updateDriverLocation.js
 *
 * Handles database operations related to the
 * driver's latest active location.
 *
 * The driver_id comes from the authenticated
 * WebSocket connection.
 *
 * This model only updates the existing
 * active_driver_location table.
 */

const pool = require("../config/dbConfig");


/*
 * Updates the driver's latest location.
 *
 * If the driver already has an active location,
 * the existing row is updated.
 *
 * If the driver does not have an active location,
 * a new row is inserted.
 */
async function updateDriverLocation(
    driverId,
    lat,
    long
) {

    const query = `
        INSERT INTO active_driver_location (
            driver_id,
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
        ON CONFLICT (driver_id)
        DO UPDATE SET
            lat = EXCLUDED.lat,
            long = EXCLUDED.long,
            updated_at = CURRENT_TIMESTAMP
        RETURNING
            active_location_id,
            driver_id,
            lat,
            long,
            updated_at
    `;

    const result =
        await pool.query(
            query,
            [
                driverId,
                lat,
                long
            ]
        );

    return result.rows[0];
}


module.exports = {
    updateDriverLocation
};