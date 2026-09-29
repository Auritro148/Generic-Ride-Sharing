/*
 * driverRegistrationModel.js
 *
 * Handles all database operations related to
 * driver registration requests.
 *
 * The client does not provide user_id.
 * The authenticated user's email is obtained
 * from the JWT and used to find user_id.
 *
 * The existing `drivers` table is intentionally
 * NOT used.
 */

const pool = require("../config/dbConfig");


// ---------------------------------------------
// Find user by email
// ---------------------------------------------
//
// The email comes from:
// req.user.id
//
// Returns the corresponding user information
// including the internal user_id.
//

async function findUserByEmail(email) {

    const query = `
        SELECT
            user_id,
            first_name,
            last_name,
            email,
            user_type
        FROM users
        WHERE email = $1
    `;

    const result = await pool.query(
        query,
        [email]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}


// ---------------------------------------------
// Find existing driver registration request
// ---------------------------------------------
//
// Uses the internal user_id obtained from
// the users table.
//

async function findDriverRequestByUserId(userId) {

    const query = `
        SELECT
            req_no,
            created_at,
            user_id,
            doc_id,
            req_status
        FROM driver_requests
        WHERE user_id = $1
    `;

    const result = await pool.query(
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
// req_status is not provided because the
// database automatically sets it to 'pending'.
//
// doc_id is optional.
//

async function createDriverRequest(userId, docId = null) {

    const query = `
        INSERT INTO driver_requests (
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

    const result = await pool.query(
        query,
        [userId, docId]
    );

    return result.rows[0];
}


// ---------------------------------------------
// Get driver registration status
// ---------------------------------------------

async function getDriverRegistrationStatus(userId) {

    const query = `
        SELECT
            req_no,
            user_id,
            doc_id,
            req_status,
            created_at
        FROM driver_requests
        WHERE user_id = $1
    `;

    const result = await pool.query(
        query,
        [userId]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}


module.exports = {
    findUserByEmail,
    findDriverRequestByUserId,
    createDriverRequest,
    getDriverRegistrationStatus
};