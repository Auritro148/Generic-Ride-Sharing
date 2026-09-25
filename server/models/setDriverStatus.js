const pool = require("../config/dbConfig");

async function setDriverStatus(
    driverId,
    mode,
    lat = null,
    long = null
) {
    if (mode !== "online" && mode !== "offline") {
        throw new Error(
            "mode must be either 'online' or 'offline'"
        );
    }

    if (mode === "online") {

        if (lat === null || long === null) {
            throw new Error(
                "Latitude and longitude are required when going online"
            );
        }

        if (
            typeof lat !== "number" ||
            typeof long !== "number"
        ) {
            throw new Error(
                "Latitude and longitude must be numbers"
            );
        }

        if (lat < -90 || lat > 90) {
            throw new Error("Invalid latitude");
        }

        if (long < -180 || long > 180) {
            throw new Error("Invalid longitude");
        }
    }

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // Update driver status
        const result = await client.query(
            `
            UPDATE drivers
            SET is_online = $1
            WHERE driver_id = $2
            RETURNING driver_id, is_online
            `,
            [
                mode === "online",
                driverId
            ]
        );

        if (result.rows.length === 0) {
            throw new Error("Driver not found");
        }


        // Driver going online
        if (mode === "online") {

            await client.query(
                `
                INSERT INTO active_driver_location
                    (driver_id, lat, long)
                VALUES
                    ($1, $2, $3)
                ON CONFLICT (driver_id)
                DO UPDATE SET
                    lat = EXCLUDED.lat,
                    long = EXCLUDED.long,
                    updated_at = CURRENT_TIMESTAMP
                `,
                [
                    driverId,
                    lat,
                    long
                ]
            );
        }


        // Driver going offline
        if (mode === "offline") {

            await client.query(
                `
                DELETE FROM active_driver_location
                WHERE driver_id = $1
                `,
                [driverId]
            );
        }


        await client.query("COMMIT");

        return result.rows[0];

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();

    }
}


async function setDriverOffline(driverId) {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // Mark driver offline
        const result = await client.query(
            `
            UPDATE drivers
            SET is_online = false
            WHERE driver_id = $1
            RETURNING driver_id, is_online
            `,
            [driverId]
        );


        // Remove active location
        await client.query(
            `
            DELETE FROM active_driver_location
            WHERE driver_id = $1
            `,
            [driverId]
        );


        await client.query("COMMIT");

        if (result.rows.length === 0) {
            return false;
        }

        return result.rows[0];

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();

    }
}


module.exports = {
    setDriverStatus,
    setDriverOffline
};