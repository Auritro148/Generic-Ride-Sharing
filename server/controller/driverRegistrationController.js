/*
 * driverRegistrationController.js
 *
 * Handles driver registration requests.
 *
 * The client does NOT provide user_id.
 *
 * The authenticated user's email is obtained
 * from req.user.id, because the JWT stores
 * the email in the `id` field.
 *
 * Driver registration is available only to users
 * already registered in the users table.
 *
 * The existing `drivers` table is intentionally
 * NOT used.
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
// 1. Check whether the authenticated user exists
// 2. Check whether a driver request exists
// 3. Create a driver registration request
// 4. Check registration status
//
// POST /core/driver/signup
//
// Expected body:
//
// {
//     "action": "register"
// }
//
// Optional:
//
// {
//     "action": "register",
//     "doc_id": 123
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
            doc_id
        } = req.body;


        // -----------------------------------------
        // Get email from authenticated JWT
        // -----------------------------------------
        //
        // JWT payload:
        //
        // {
        //     "id": "user@example.com"
        // }
        //
        // Therefore:
        //
        // req.user.id = user's email
        //

        const email = req.user?.id;


        if (!email) {

            return res.status(401).json({

                message:
                    "User identity is missing from authentication token"

            });

        }


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

                message:
                    "action is required"

            });

        }


        if (!validActions.includes(action)) {

            return res.status(400).json({

                message:
                    "Invalid action"

            });

        }


        // -----------------------------------------
        // Find authenticated user
        // -----------------------------------------
        //
        // The client does not provide user_id.
        //
        // Email comes from JWT and user_id is
        // obtained from the users table.
        //

        const user =
            await driverRegistrationModel.findUserByEmail(
                email
            );


        // -----------------------------------------
        // Check whether user exists
        // -----------------------------------------

        if (action === "check_user") {

            if (!user) {

                return res.status(404).json({

                    registered: false,

                    message:
                        "User is not registered"

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
        // All remaining operations require an
        // existing user.
        // -----------------------------------------

        if (!user) {

            return res.status(404).json({

                registered_user: false,

                message:
                    "User is not registered"

            });

        }


        // -----------------------------------------
        // Check existing driver request
        // -----------------------------------------

        if (action === "check_driver") {

            const driverRequest =
                await driverRegistrationModel.findDriverRequestByUserId(
                    user.user_id
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
            // Check existing request
            // -------------------------------------

            const existingRequest =
                await driverRegistrationModel.findDriverRequestByUserId(
                    user.user_id
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
            //
            // doc_id is optional because documents
            // are uploaded through another API.
            //
            // If no doc_id is provided, NULL is
            // stored in driver_requests.doc_id.
            //

            const driverRequest =
                await driverRegistrationModel.createDriverRequest(
                    user.user_id,
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
                    user.user_id
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
        // Handle duplicate driver request
        // -----------------------------------------
        //
        // driver_requests.user_id has a UNIQUE
        // constraint.
        //
        // This also protects against two requests
        // arriving simultaneously.
        //

        if (error.code === "23505") {

            return res.status(409).json({

                message:
                    "Driver registration request already exists"

            });

        }


        // -----------------------------------------
        // Handle foreign-key violation
        // -----------------------------------------

        if (error.code === "23503") {

            return res.status(400).json({

                message:
                    "Invalid user"

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