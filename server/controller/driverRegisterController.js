/*
 * driverRegistrationController.js
 *
 * Handles driver registration requests.
 *
 * Driver registration is available only to users
 * who are already registered in the users table.
 *
 * The existing `drivers` table is intentionally NOT used.
 *
 * Registration is stored in driver_requests and
 * remains subject to future admin approval.
 */


const driverRegistrationModel =
    require("../models/driverRegistrationModel");


// ---------------------------------------------
// Driver registration controller
// ---------------------------------------------
//
// Supported operations:
//
// 1. Check whether a user exists
// 2. Check whether a driver request exists
// 3. Create a driver registration request
// 4. Check registration status
//
// POST /core/driver/signup
//
// Expected body:
//
// {
//     "action": "register",
//     "user_id": "uuid"
// }
//
// Supported actions:
//
// "check_user"
// "check_driver"
// "register"
// "status"
//
async function driverRegistrationController(req, res) {

    try {

        const {
            action,
            user_id,
            doc_id
        } = req.body;


        // -----------------------------------------
        // Validate action
        // -----------------------------------------

        const validActions = [
            "check_user",
            "check_driver",
            "register",
            "status"
        ];


        if (!action) {

            return res.status(400).json({
                message: "action is required"
            });

        }


        if (!validActions.includes(action)) {

            return res.status(400).json({
                message: "Invalid action"
            });

        }


        // -----------------------------------------
        // Validate user ID
        // -----------------------------------------

        if (!user_id) {

            return res.status(400).json({
                message: "user_id is required"
            });

        }


        // -----------------------------------------
        // Check whether user exists
        // -----------------------------------------

        if (action === "check_user") {

            const user =
                await driverRegistrationModel.findUserById(
                    user_id
                );


            if (!user) {

                return res.status(404).json({
                    registered: false,
                    message: "User is not registered"
                });

            }


            return res.status(200).json({

                registered: true,

                user: {
                    user_id: user.user_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    user_type: user.user_type
                }

            });

        }


        // -----------------------------------------
        // Check existing driver request
        // -----------------------------------------

        if (action === "check_driver") {

            const user =
                await driverRegistrationModel.findUserById(
                    user_id
                );


            if (!user) {

                return res.status(404).json({
                    registered_user: false,
                    message: "User is not registered"
                });

            }


            const driverRequest =
                await driverRegistrationModel.findDriverRequestByUserId(
                    user_id
                );


            if (!driverRequest) {

                return res.status(200).json({

                    registered_user: true,
                    driver_registered: false,

                    message:
                        "User has no driver registration request"

                });

            }


            return res.status(200).json({

                registered_user: true,
                driver_registered: true,

                request: driverRequest

            });

        }


        // -----------------------------------------
        // Register as driver
        // -----------------------------------------

        if (action === "register") {

            // -------------------------------------
            // User must already exist
            // -------------------------------------

            const user =
                await driverRegistrationModel.findUserById(
                    user_id
                );


            if (!user) {

                return res.status(404).json({

                    message:
                        "Only registered users can apply for driver registration"

                });

            }


            // -------------------------------------
            // Check existing request
            // -------------------------------------

            const existingRequest =
                await driverRegistrationModel.findDriverRequestByUserId(
                    user_id
                );


            if (existingRequest) {

                return res.status(409).json({

                    message:
                        "Driver registration request already exists",

                    request:
                        existingRequest

                });

            }


            // -------------------------------------
            // Create pending request
            // -------------------------------------

            const driverRequest =
                await driverRegistrationModel.createDriverRequest(
                    user_id,
                    doc_id ?? null
                );


            return res.status(201).json({

                message:
                    "Driver registration request submitted successfully",

                request:
                    driverRequest

            });

        }


        // -----------------------------------------
        // Check registration status
        // -----------------------------------------

        if (action === "status") {

            const driverRequest =
                await driverRegistrationModel.getDriverRegistrationStatus(
                    user_id
                );


            if (!driverRequest) {

                return res.status(404).json({

                    message:
                        "No driver registration request found"

                });

            }


            return res.status(200).json({

                req_no:
                    driverRequest.req_no,

                user_id:
                    driverRequest.user_id,

                req_status:
                    driverRequest.req_status,

                created_at:
                    driverRequest.created_at,

                doc_id:
                    driverRequest.doc_id

            });

        }

    } catch (error) {

        console.error(
            "Driver registration error:",
            error
        );


        // -----------------------------------------
        // Handle duplicate user request
        // -----------------------------------------
        //
        // driver_requests.user_id has a UNIQUE
        // constraint. This protects the database
        // even if two registration requests arrive
        // simultaneously.
        //

        if (error.code === "23505") {

            return res.status(409).json({

                message:
                    "Driver registration request already exists"

            });

        }


        // -----------------------------------------
        // Handle invalid foreign key
        // -----------------------------------------

        if (error.code === "23503") {

            return res.status(400).json({

                message:
                    "Invalid user ID"

            });

        }


        return res.status(500).json({

            message:
                "Driver registration operation failed"

        });

    }

}


module.exports = {
    driverRegistrationController
};