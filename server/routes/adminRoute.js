/*
 * adminRoute.js
 *
 * Standalone Admin API
 *
 * Endpoint:
 *
 *     POST /core/admin
 *
 * No JWT verification is currently used.
 *
 * Every request must provide:
 *
 * {
 *     "admin_id": "ADMIN-UUID",
 *     "password": "ADMIN-PASSWORD",
 *     "command": "COMMAND"
 * }
 *
 *
 * Supported commands:
 *
 * 1. show_pending_drivers
 *
 * 2. add_driver
 *
 *
 * Admins are manually created in the
 * public.admins table.
 *
 * The password stored in admins.hash_pass
 * must be a bcrypt hash.
 */

const express =
    require("express");

const bcrypt =
    require("bcryptjs");

const pool =
    require("../config/dbConfig");


const router =
    express.Router();


/*
 * ============================================================
 * ADMIN AUTHENTICATION
 * ============================================================
 *
 * Verify the admin_id and password.
 *
 * No JWT is used here.
 */
async function authenticateAdmin(
    adminId,
    password
) {
    const query = `
        SELECT
            admin_id,
            hash_pass
        FROM public.admins
        WHERE admin_id = $1
    `;

    const result =
        await pool.query(
            query,
            [adminId]
        );


    /*
     * Admin does not exist.
     */
    if (
        result.rows.length === 0
    ) {
        return null;
    }


    const admin =
        result.rows[0];


    /*
     * Compare the supplied password
     * with the bcrypt hash stored in
     * admins.hash_pass.
     */
    const passwordValid =
        await bcrypt.compare(
            password,
            admin.hash_pass
        );


    if (!passwordValid) {
        return null;
    }


    return {
        admin_id:
            admin.admin_id
    };
}


/*
 * ============================================================
 * SHOW PENDING DRIVERS
 * ============================================================
 *
 * Returns all driver registration requests
 * whose status is currently "pending".
 *
 * The user information is included so that
 * the administrator can identify the applicant.
 */
async function getPendingDrivers() {
    const query = `
        SELECT
            dr.req_no,
            dr.created_at,
            dr.user_id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            dr.doc_id,
            dr.req_status
        FROM public.driver_requests dr
        INNER JOIN public.users u
            ON u.user_id = dr.user_id
        WHERE dr.req_status = 'pending'
        ORDER BY dr.created_at ASC
    `;


    const result =
        await pool.query(query);


    return result.rows;
}


/*
 * ============================================================
 * ADD DRIVER
 * ============================================================
 *
 * Promotes a pending driver request into
 * the public.drivers table.
 *
 * Input:
 *
 * {
 *     "req_no": 12
 * }
 *
 *
 * Flow:
 *
 * driver_requests
 *       |
 *       | user_id
 *       v
 * drivers
 *
 *
 * The operation is transactional.
 *
 * If inserting the driver fails,
 * the request remains untouched.
 *
 * After successful insertion, the
 * driver_request is deleted because
 * the request has been completed.
 */
async function addDriver(
    reqNo
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
         * Lock the pending request.
         *
         * This prevents two admins from
         * adding the same driver simultaneously.
         */
        const requestResult =
            await client.query(
                `
                SELECT
                    dr.req_no,
                    dr.user_id,
                    dr.req_status,
                    u.first_name,
                    u.last_name,
                    u.email,
                    u.phone
                FROM public.driver_requests dr
                INNER JOIN public.users u
                    ON u.user_id = dr.user_id
                WHERE dr.req_no = $1
                  AND dr.req_status = 'pending'
                FOR UPDATE
                `,
                [reqNo]
            );


        /*
         * Request does not exist or is
         * no longer pending.
         */
        if (
            requestResult.rows.length === 0
        ) {
            throw new Error(
                "Pending driver request not found"
            );
        }


        const request =
            requestResult.rows[0];


        /*
         * Check whether this user is
         * already registered as a driver.
         */
        const existingDriver =
            await client.query(
                `
                SELECT
                    driver_id
                FROM public.drivers
                WHERE driver_id = $1
                `,
                [request.user_id]
            );


        if (
            existingDriver.rows.length > 0
        ) {
            throw new Error(
                "User is already registered as a driver"
            );
        }


        /*
         * Create the driver.
         *
         * Only driver_id is required here.
         *
         * active_vehicle_id and is_online
         * use their database defaults.
         */
        const driverResult =
            await client.query(
                `
                INSERT INTO public.drivers (
                    driver_id
                )
                VALUES ($1)
                RETURNING
                    driver_id,
                    active_vehicle_id,
                    is_online
                `,
                [request.user_id]
            );


        /*
         * The registration request has
         * now been successfully processed.
         *
         * Remove the pending request.
         */
        await client.query(
            `
            DELETE FROM public.driver_requests
            WHERE req_no = $1
            `,
            [reqNo]
        );


        /*
         * Commit the entire operation.
         */
        await client.query(
            "COMMIT"
        );


        return {
            request: {
                req_no:
                    request.req_no,

                user_id:
                    request.user_id,

                first_name:
                    request.first_name,

                last_name:
                    request.last_name,

                email:
                    request.email,

                phone:
                    request.phone
            },

            driver:
                driverResult.rows[0]
        };

    } catch (error) {

        /*
         * Undo everything if any operation
         * failed.
         */
        await client.query(
            "ROLLBACK"
        );

        throw error;

    } finally {

        /*
         * Return connection to pool.
         */
        client.release();
    }
}


/*
 * ============================================================
 * ADMIN API
 * ============================================================
 *
 * POST /core/admin
 *
 * Example:
 *
 * {
 *     "admin_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
 *     "password": "adminPassword",
 *     "command": "show_pending_drivers"
 * }
 */
router.post(
    "/",
    async (req, res) => {

        try {

            const {
                admin_id,
                password,
                command
            } = req.body;


            /*
             * Validate admin credentials.
             */
            if (!admin_id) {
                return res.status(400).json({
                    message:
                        "admin_id is required"
                });
            }


            if (!password) {
                return res.status(400).json({
                    message:
                        "password is required"
                });
            }


            if (!command) {
                return res.status(400).json({
                    message:
                        "command is required"
                });
            }


            /*
             * Authenticate administrator.
             */
            const admin =
                await authenticateAdmin(
                    admin_id,
                    password
                );


            if (!admin) {
                return res.status(401).json({
                    message:
                        "Invalid admin ID or password"
                });
            }


            /*
             * Normalize command.
             */
            const adminCommand =
                String(command)
                    .trim()
                    .toLowerCase();


            /*
             * ==================================================
             * COMMAND: SHOW PENDING DRIVERS
             * ==================================================
             */
            if (
                adminCommand ===
                "show_pending_drivers"
            ) {

                const drivers =
                    await getPendingDrivers();


                return res.status(200).json({
                    message:
                        "Pending driver requests retrieved successfully",

                    count:
                        drivers.length,

                    drivers
                });
            }


            /*
             * ==================================================
             * COMMAND: ADD DRIVER
             * ==================================================
             *
             * Required additional field:
             *
             * req_no
             */
            if (
                adminCommand ===
                "add_driver"
            ) {

                const {
                    req_no
                } = req.body;


                if (
                    req_no === undefined ||
                    req_no === null
                ) {
                    return res.status(400).json({
                        message:
                            "req_no is required for add_driver command"
                    });
                }


                const requestNumber =
                    Number(req_no);


                if (
                    !Number.isInteger(
                        requestNumber
                    ) ||
                    requestNumber <= 0
                ) {
                    return res.status(400).json({
                        message:
                            "req_no must be a valid positive integer"
                    });
                }


                const result =
                    await addDriver(
                        requestNumber
                    );


                return res.status(200).json({
                    message:
                        "Driver added successfully",

                    request:
                        result.request,

                    driver:
                        result.driver
                });
            }


            /*
             * ==================================================
             * UNKNOWN COMMAND
             * ==================================================
             */
            return res.status(400).json({
                message:
                    "Unknown admin command",

                supported_commands: [
                    "show_pending_drivers",
                    "add_driver"
                ]
            });

        } catch (error) {

            console.error(
                "Admin API error:",
                error
            );


            /*
             * Pending request does not exist.
             */
            if (
                error.message ===
                "Pending driver request not found"
            ) {
                return res.status(404).json({
                    message:
                        "Pending driver request not found"
                });
            }


            /*
             * User is already a driver.
             */
            if (
                error.message ===
                "User is already registered as a driver"
            ) {
                return res.status(409).json({
                    message:
                        "User is already registered as a driver"
                });
            }


            /*
             * Database constraint violation.
             */
            if (
                error.code === "23505"
            ) {
                return res.status(409).json({
                    message:
                        "Driver already exists"
                });
            }


            return res.status(500).json({
                message:
                    "Admin operation failed"
            });
        }
    }
);


module.exports =
    router;