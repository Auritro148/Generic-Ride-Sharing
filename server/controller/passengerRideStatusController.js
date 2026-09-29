/*
 * passengerRideStatusController.js
 *
 * Implements HTTP long polling for passenger
 * ride-status notifications.
 *
 * The client provides only req_id.
 *
 * Passenger identity comes from the JWT.
 */

const {
    findPassengerByEmail,
    findPassengerRideRequest
} =
    require("../models/passengerRideStatusModel");

const {
    addWaitingPassenger,
    removeWaitingPassenger
} =
    require("../utils/passengerRideNotificationManager");

/*
 * Maximum amount of time a long-polling
 * request stays open.
 */
const LONG_POLL_TIMEOUT =
    30000;

async function passengerRideStatusController(
    req,
    res
) {
    try {
        /*
         * The current JWT stores the user's
         * email in req.user.id.
         */
        const email =
            req.user?.id;

        if (!email) {
            return res.status(401).json({
                message:
                    "User identity is missing from authentication token"
            });
        }

        const reqId =
            Number(req.query.req_id);

        if (
            !Number.isInteger(reqId) ||
            reqId <= 0
        ) {
            return res.status(400).json({
                message:
                    "A valid req_id is required"
            });
        }

        /*
         * Resolve passenger_id from the
         * authenticated user's email.
         */
        const passenger =
            await findPassengerByEmail(
                email
            );

        if (!passenger) {
            return res.status(404).json({
                message:
                    "Authenticated user is not registered as a passenger"
            });
        }

        /*
         * Make sure this ride request belongs
         * to the authenticated passenger.
         */
        const rideRequest =
            await findPassengerRideRequest(
                passenger.passenger_id,
                reqId
            );

        if (!rideRequest) {
            return res.status(404).json({
                message:
                    "Ride request not found"
            });
        }

        /*
         * Create the waiting request object.
         */
        const waiter = {
            res,
            reqId,
            timeout: null
        };

        /*
         * Keep the connection open.
         */
        waiter.timeout =
            setTimeout(() => {
                removeWaitingPassenger(
                    passenger.passenger_id,
                    waiter
                );

                if (!res.writableEnded) {
                    res.status(200).json({
                        type: "timeout",
                        data: {
                            req_id: reqId
                        }
                    });
                }
            }, LONG_POLL_TIMEOUT);

        addWaitingPassenger(
            passenger.passenger_id,
            waiter
        );

        /*
         * If the passenger closes the browser,
         * navigates away, etc., clean up the
         * waiting request.
         */
        req.on(
            "close",
            () => {
                clearTimeout(
                    waiter.timeout
                );

                removeWaitingPassenger(
                    passenger.passenger_id,
                    waiter
                );
            }
        );

    } catch (error) {
        console.error(
            "Passenger ride status error:",
            error
        );

        if (!res.headersSent) {
            return res.status(500).json({
                message:
                    "Failed to wait for ride status"
            });
        }
    }
}

module.exports = {
    passengerRideStatusController
};