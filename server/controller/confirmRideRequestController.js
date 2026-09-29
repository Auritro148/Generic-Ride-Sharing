/*
 * confirmRideRequestController.js
 *
 * Handles driver confirmation of a ride request.
 *
 * The client provides only:
 *
 * {
 *     "req_id": 123
 * }
 *
 * driver_id is NOT provided by the client.
 *
 * The authenticated user's email is obtained
 * from the JWT:
 *
 *     req.user.id
 *
 * The email is then used to find the
 * corresponding driver_id.
 */

const {
    findDriverByEmail,
    confirmRideRequest
} =
    require("../models/confirmRideRequest");


const {
    notifyRideAccepted
} =
    require("../utils/passengerRideNotificationManager");


async function confirmRideRequestController(
    req,
    res
) {
    try {

        /*
         * The current JWT stores the
         * authenticated user's email
         * inside req.user.id.
         */
        const email =
            req.user?.id;


        if (!email) {
            return res.status(401).json({
                message:
                    "User identity is missing from authentication token"
            });
        }


        /*
         * The client only provides req_id.
         */
        const {
            req_id
        } = req.body;


        if (
            req_id === undefined ||
            req_id === null
        ) {
            return res.status(400).json({
                message:
                    "req_id is required"
            });
        }


        /*
         * Convert req_id to a number.
         */
        const requestId =
            Number(req_id);


        if (
            !Number.isInteger(requestId) ||
            requestId <= 0
        ) {
            return res.status(400).json({
                message:
                    "req_id must be a valid positive integer"
            });
        }


        /*
         * Find the driver using the
         * authenticated user's email.
         */
        const driver =
            await findDriverByEmail(
                email
            );


        if (!driver) {
            return res.status(403).json({
                message:
                    "Authenticated user is not registered as a driver"
            });
        }


        const driverId =
            driver.driver_id;


        /*
         * Accept the ride request and
         * create the trip.
         *
         * The database transaction must
         * complete successfully before
         * notifying the passenger.
         */
        const result =
            await confirmRideRequest(
                driverId,
                requestId
            );


        /*
         * Notify the passenger's currently
         * waiting HTTP long-poll request.
         *
         * This happens only AFTER the
         * database transaction has committed.
         */
        notifyRideAccepted(
            result.passengerId,
            result.reqId,
            result.tripId
        );


        /*
         * Respond to the driver.
         */
        return res.status(200).json({
            message:
                "Ride request accepted successfully",

            req_id:
                Number(result.reqId),

            trip_id:
                Number(result.tripId)
        });

    } catch (error) {

        console.error(
            "Ride request confirmation error:",
            error
        );


        /*
         * Ride request was already accepted
         * or does not exist.
         */
        if (
            error.message?.includes(
                "does not exist or has already been accepted"
            )
        ) {
            return res.status(409).json({
                message:
                    "Ride request does not exist or has already been accepted"
            });
        }


        /*
         * Ride request location is missing.
         */
        if (
            error.message?.includes(
                "Location data for ride request"
            )
        ) {
            return res.status(400).json({
                message:
                    "Ride request location data is missing"
            });
        }


        /*
         * Pickup address is missing.
         */
        if (
            error.message?.includes(
                "Pickup address is missing"
            )
        ) {
            return res.status(400).json({
                message:
                    "Pickup address is missing"
            });
        }


        /*
         * Dropoff address is missing.
         */
        if (
            error.message?.includes(
                "Dropoff address is missing"
            )
        ) {
            return res.status(400).json({
                message:
                    "Dropoff address is missing"
            });
        }


        /*
         * Procedure completed but the
         * trip could not be found.
         */
        if (
            error.message?.includes(
                "Trip was not created successfully"
            )
        ) {
            return res.status(500).json({
                message:
                    "Ride was accepted but trip creation failed"
            });
        }


        /*
         * Unexpected database/server error.
         */
        return res.status(500).json({
            message:
                "Failed to accept ride request"
        });
    }
}


module.exports = {
    confirmRideRequestController
};