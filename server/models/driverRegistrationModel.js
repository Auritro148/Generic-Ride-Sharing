/*
 * driverRegistrationModel.js
 *
 * Database interface for driver registration requests.
 *
 * The existing `drivers` table is intentionally NOT used.
 *
 * Registration flow:
 *
 * users
 *   ↓
 * driver_requests
 *   ├── pending
 *   ├── approved
 *   └── declined
 *
 * All database operations for driver registration
 * are implemented in this file.
 */


const pool = require("../config/dbConfig");


// ---------------------------------------------
// Find user by user ID
// ---------------------------------------------
//
// Determines whether the supplied user_id belongs
// to an existing registered user.
//
// @param {string} userId
// @returns {Object|null}
//
async function findUserById(userId) {

    const query = `
        SELECT
            user_id,
            first_name,
            last_name,
            email,
            user_type
        FROM public.users
        WHERE user_id = $1
    `;

    const result =
        await pool.query(
            query,
            [userId]
        );


    if (result.rows.length === 0) {

        return null;

    }


    return result.rows[0];
}


// ---------------------------------------------
// Find driver registration request by user ID
// ---------------------------------------------
//
// Checks whether the user already has a
// driver registration request.
//
// driver_requests.user_id is UNIQUE, therefore
// one user can have only one request.
//
// @param {string} userId
// @returns {Object|null}
//
async function findDriverRequestByUserId(userId) {

    const query = `
        SELECT
            req_no,
            created_at,
            user_id,
            doc_id,
            req_status
        FROM public.driver_requests
        WHERE user_id = $1
    `;


    const result =
        await pool.query(
            query,
            [userId]
        );


    if (result.rows.length === 0) {

        return null;

    }


    return result.rows[0];
}


// ---------------------------------------------
// Create driver registration request
// ---------------------------------------------
//
// Creates a new pending driver request.
//
// req_status is intentionally not supplied because
// the database default is:
//
//     'pending'
//
// @param {string} userId
// @param {number|null} docId
// @returns {Object}
//
async function createDriverRequest(
    userId,
    docId = null
) {

    const query = `
        INSERT INTO public.driver_requests (
            user_id,
            doc_id
        )
        VALUES ($1, $2)
        RETURNING
            req_no,
            created_at,
            user_id,
            doc_id,
            req_status
    `;


    const result =
        await pool.query(
            query,
            [
                userId,
                docId
            ]
        );


    return result.rows[0];
}


// ---------------------------------------------
// Get driver registration status
// ---------------------------------------------
//
// Returns the current registration request.
//
// @param {string} userId
// @returns {Object|null}
//
async function getDriverRegistrationStatus(userId) {

    const query = `
        SELECT
            req_no,
            created_at,
            user_id,
            doc_id,
            req_status
        FROM public.driver_requests
        WHERE user_id = $1
    `;


    const result =
        await pool.query(
            query,
            [userId]
        );


    if (result.rows.length === 0) {

        return null;

    }


    return result.rows[0];
}


module.exports = {

    findUserById,

    findDriverRequestByUserId,

    createDriverRequest,

    getDriverRegistrationStatus

};