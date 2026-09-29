/*
 * confirmRideRequest.js
 *
 * Handles database operations for accepting
 * a ride request.
 *
 * The driver_id is NOT provided by the client.
 *
 * The authenticated user's email comes from:
 *
 *     req.user.id
 *
 * The email is used to find the corresponding
 * driver_id from the database.
 */

const pool =
    require("../config/dbConfig");


/*
 * Find the driver associated with the
 * authenticated user's email.
 *
 * users.email
 *      ↓
 * users.user_id
 *      ↓
 * drivers.driver_id
 */
async function findDriverByEmail(
    email
) {
    const query = `
        SELECT
            d.driver_id
        FROM users u
        INNER JOIN drivers d
            ON d.driver_id = u.user_id
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
 * Accept a ride request and create
 * the corresponding trip.
 *
 * This operation is performed inside
 * a database transaction.
 */
async function confirmRideRequest(
    driverId,
    reqId
) {
    const client =
        await pool.connect();

    try {
        /*
         * Start transaction.
         */
        await client.query(
            "BEGIN"
        );


        /*
         * Lock the ride request.
         *
         * This prevents two drivers from
         * accepting the same ride request
         * simultaneously.
         */
        const requestResult =
            await client.query(
                `
                SELECT
                    passenger_id
                FROM ride_requests
                WHERE req_id = $1
                FOR UPDATE
                `,
                [reqId]
            );

        if (
            requestResult.rows.length === 0
        ) {
            throw new Error(
                "Ride request does not exist or has already been accepted"
            );
        }


        /*
         * Store the passenger_id before
         * the stored procedure removes
         * the ride request.
         */
        const passengerId =
            requestResult.rows[0]
                .passenger_id;


        /*
         * Create the trip using the
         * existing database procedure.
         *
         * The procedure:
         *
         * 1. Creates the trip.
         * 2. Creates trip_location_data.
         * 3. Deletes ride_request_location.
         * 4. Deletes ride_requests.
         */
        await client.query(
            `
            CALL create_trip_from_request(
                $1,
                $2
            )
            `,
            [
                driverId,
                reqId
            ]
        );


        /*
         * The procedure does not return
         * the generated trip_id.
         *
         * Retrieve it using req_id.
         *
         * This query is executed using the
         * same transaction connection, so
         * the newly created trip is visible
         * before COMMIT.
         */
        const tripResult =
            await client.query(
                `
                SELECT
                    trip_id
                FROM trips
                WHERE req_id = $1
                `,
                [reqId]
            );

        if (
            tripResult.rows.length === 0
        ) {
            throw new Error(
                "Trip was not created successfully"
            );
        }


        const tripId =
            tripResult.rows[0]
                .trip_id;


        /*
         * Commit only after every database
         * operation has succeeded.
         */
        await client.query(
            "COMMIT"
        );


        return {
            passengerId,
            reqId,
            tripId
        };

    } catch (error) {

        /*
         * Roll back the entire operation
         * if anything fails.
         */
        await client.query(
            "ROLLBACK"
        );

        throw error;

    } finally {

        /*
         * Always release the database
         * connection back to the pool.
         */
        client.release();
    }
}


module.exports = {
    findDriverByEmail,
    confirmRideRequest
};