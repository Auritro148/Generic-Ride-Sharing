/*
 * confirmRideRequestController.js
 *
 * Handles driver confirmation of a ride request.
 *
 * The client only provides req_id.
 *
 * driver_id is obtained from the authenticated
 * driver's JWT.
 */

const {
    confirmRideRequest
} = require("../models/confirmRideRequest");

async function confirmRideRequestController(
    req,
    res
) {
    try {
        const {
            req_id
        } = req.body;

        /*
         * driver_id comes from the JWT.
         *
         * Your driver WebSocket already resolves
         * the authenticated driver identity this way.
         */
        const driverId =
            req.user?.driver_id;

        if (!driverId) {
            return res.status(401).json({
                message:
                    "Driver identity is missing from authentication token"
            });
        }

        if (
            req_id === undefined ||
            req_id === null
        ) {
            return res.status(400).json({
                message:
                    "req_id is required"
            });
        }

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

        await confirmRideRequest(
            driverId,
            requestId
        );

        return res.status(200).json({
            message:
                "Ride request accepted successfully",
            req_id:
                requestId
        });

    } catch (error) {
        console.error(
            "Ride request confirmation error:",
            error
        );

        /*
         * The procedure raises an exception when
         * the request does not exist or has already
         * been accepted.
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

        return res.status(500).json({
            message:
                "Failed to accept ride request"
        });
    }
}

module.exports = {
    confirmRideRequestController
};