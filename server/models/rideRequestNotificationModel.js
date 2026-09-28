/*
 * rideRequestNotificationModel.js
 *
 * Database interface for retrieving the information
 * required by the ride-request WebSocket notification.
 *
 * This is kept separate from getNearbyEligibleDrivers()
 * so the existing driver-eligibility implementation
 * does not need to be modified.
 */


const pool = require("../config/dbConfig");


// ---------------------------------------------
// Get ride request notification data
// ---------------------------------------------
//
// Gets:
//
// 1. Pickup location
// 2. Dropoff location
// 3. Passenger full name
// 4. Estimated fare
//
// Relationships:
//
// ride_requests.passenger_id
//          ↓
// passengers.passenger_id
//          ↓
// users.user_id
//
// ride_requests.req_id
//          ↓
// ride_request_location.req_id
//
// @param {number} reqId
// @returns {Object|null}
//

async function getRideRequestNotificationData(reqId) {

    const query = `
        SELECT
            rr.req_id,
            rr.est_fare,

            u.first_name,
            u.last_name,

            rrl.pickup_lat,
            rrl.pickup_long,
            rrl.drop_lat,
            rrl.drop_long,

            rrl.pick_addr,
            rrl.drop_addr,

            rrl.pick_name,
            rrl.drop_name

        FROM public.ride_requests rr

        INNER JOIN public.passengers p
            ON p.passenger_id = rr.passenger_id

        INNER JOIN public.users u
            ON u.user_id = p.passenger_id

        INNER JOIN public.ride_request_location rrl
            ON rrl.req_id = rr.req_id

        WHERE rr.req_id = $1
    `;


    const result =
        await pool.query(
            query,
            [reqId]
        );


    if (result.rows.length === 0) {

        return null;

    }


    const row =
        result.rows[0];


    const firstName =
        row.first_name || "";


    const lastName =
        row.last_name || "";


    return {

        req_id:
            row.req_id,

        passenger_name:
            `${firstName} ${lastName}`.trim(),

        est_fare:
            row.est_fare,

        pickup: {

            latitude:
                row.pickup_lat,

            longitude:
                row.pickup_long,

            address:
                row.pick_addr,

            name:
                row.pick_name

        },

        dropoff: {

            latitude:
                row.drop_lat,

            longitude:
                row.drop_long,

            address:
                row.drop_addr,

            name:
                row.drop_name

        }

    };

}


module.exports = {
    getRideRequestNotificationData
};