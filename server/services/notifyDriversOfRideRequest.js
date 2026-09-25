/*
 * notifyDriversOfRideRequest.js
 *
 * Finds eligible nearby drivers and sends the
 * ride request to their active WebSocket connections.
 *
 *
 * Database layer:
 *
 * getNearbyEligibleDrivers()
 *
 * determines:
 *
 *     Who is eligible?
 *
 *
 * WebSocket layer:
 *
 * driverSocketManager
 *
 * determines:
 *
 *     How do we reach that driver?
 */


const WebSocket = require("ws");

const {
    getNearbyEligibleDrivers
} = require("../models/getNearbyEligibleDrivers");

const {
    getDriverSocket
} = require("../websocket/driverSocketManager");


async function notifyDriversOfRideRequest(reqId) {

    // -----------------------------------------
    // Find eligible nearby drivers
    // -----------------------------------------

    const drivers =
        await getNearbyEligibleDrivers(
            reqId
        );


    const notifiedDrivers = [];

    const unavailableDrivers = [];


    // -----------------------------------------
    // Notify each eligible driver
    // -----------------------------------------

    for (const driver of drivers) {

        const socket =
            getDriverSocket(
                driver.driver_id
            );


        /*
         * A driver can satisfy the database
         * eligibility conditions but no longer
         * have an active WebSocket connection.
         *
         * In that case we cannot notify them.
         */

        if (
            !socket ||
            socket.readyState !== WebSocket.OPEN
        ) {

            unavailableDrivers.push(
                driver.driver_id
            );

            continue;
        }


        // -----------------------------------------
        // Create WebSocket notification
        // -----------------------------------------

        const notification = {

            type: "ride_request",

            data: {

                req_id: reqId,

                distance_meters:
                    Number(
                        driver.distance_meters
                    )

            }

        };


        // -----------------------------------------
        // Send notification
        // -----------------------------------------

        try {

            socket.send(
                JSON.stringify(
                    notification
                )
            );


            notifiedDrivers.push(
                driver.driver_id
            );

        } catch (error) {

            console.error(
                `Failed to notify driver ${driver.driver_id}:`,
                error
            );

            unavailableDrivers.push(
                driver.driver_id
            );

        }

    }


    // -----------------------------------------
    // Return notification information
    // -----------------------------------------

    return {

        req_id: reqId,

        eligible_driver_count:
            drivers.length,

        notified_driver_count:
            notifiedDrivers.length,

        notified_drivers:
            notifiedDrivers,

        unavailable_drivers:
            unavailableDrivers

    };
}


module.exports = {
    notifyDriversOfRideRequest
};