/*
 * updatePassengerLocationController.js
 *
 * Handles requests for updating the
 * authenticated passenger's active location.
 *
 * The client does NOT provide passenger_id.
 *
 * The passenger is identified using:
 *
 * req.user.id
 *
 * The current JWT stores the user's email
 * in the "id" field.
 *
 * Expected request body:
 *
 * {
 *     "lat": 23.8103,
 *     "long": 90.4125
 * }
 */

const {
    findPassengerByEmail,
    updatePassengerLocation
} = require("../models/updatePassengerLocation");


/*
 * Validates latitude.
 *
 * Valid range:
 *
 * -90 <= latitude <= 90
 */
function isValidLatitude(lat) {

    return (
        typeof lat === "number" &&
        Number.isFinite(lat) &&
        lat >= -90 &&
        lat <= 90
    );
}


/*
 * Validates longitude.
 *
 * Valid range:
 *
 * -180 <= longitude <= 180
 */
function isValidLongitude(long) {

    return (
        typeof long === "number" &&
        Number.isFinite(long) &&
        long >= -180 &&
        long <= 180
    );
}


/*
 * Updates the authenticated passenger's
 * active location.
 */
async function updatePassengerLocationController(
    req,
    res
) {

    try {

        /*
         * --------------------------------
         * 1. Get authenticated user
         * --------------------------------
         *
         * The JWT contains the user's email
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
         * --------------------------------
         * 2. Read location from request
         * --------------------------------
         */

        const {
            lat,
            long
        } = req.body;


        /*
         * --------------------------------
         * 3. Validate required fields
         * --------------------------------
         */

        if (
            lat === undefined ||
            lat === null
        ) {

            return res.status(400).json({
                message:
                    "lat is required"
            });

        }


        if (
            long === undefined ||
            long === null
        ) {

            return res.status(400).json({
                message:
                    "long is required"
            });

        }


        /*
         * --------------------------------
         * 4. Convert coordinates to numbers
         * --------------------------------
         */

        const latitude =
            Number(lat);

        const longitude =
            Number(long);


        /*
         * --------------------------------
         * 5. Validate coordinates
         * --------------------------------
         */

        if (!isValidLatitude(latitude)) {

            return res.status(400).json({
                message:
                    "lat must be a valid latitude between -90 and 90"
            });

        }


        if (!isValidLongitude(longitude)) {

            return res.status(400).json({
                message:
                    "long must be a valid longitude between -180 and 180"
            });

        }


        /*
         * --------------------------------
         * 6. Find passenger
         * --------------------------------
         *
         * passenger_id is derived from the
         * authenticated user's email.
         */

        const passenger =
            await findPassengerByEmail(email);


        if (!passenger) {

            return res.status(404).json({
                message:
                    "Authenticated user is not registered as a passenger"
            });

        }


        /*
         * --------------------------------
         * 7. Update passenger location
         * --------------------------------
         */

        const location =
            await updatePassengerLocation(
                passenger.passenger_id,
                latitude,
                longitude
            );


        /*
         * --------------------------------
         * 8. Return updated location
         * --------------------------------
         */

        return res.status(200).json({

            message:
                "Passenger location updated successfully",

            location: {
                active_location_id:
                    location.active_location_id,

                passenger_id:
                    location.passenger_id,

                lat:
                    Number(location.lat),

                long:
                    Number(location.long),

                updated_at:
                    location.updated_at
            }

        });

    } catch (error) {

        console.error(
            "Passenger location update error:",
            error
        );


        /*
         * Unique constraint violation.
         */

        if (error.code === "23505") {

            return res.status(409).json({
                message:
                    "Passenger active location already exists"
            });

        }


        /*
         * Foreign key violation.
         */

        if (error.code === "23503") {

            return res.status(400).json({
                message:
                    "Invalid passenger"
            });

        }


        return res.status(500).json({
            message:
                "Failed to update passenger location"
        });

    }

}


module.exports = {
    updatePassengerLocationController
};