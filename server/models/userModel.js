
/*
 * userModel.js
 *
 * Database interface for user registration.
 *
 * The controller should only interact with these functions.
 * Database queries should be implemented inside these functions.
 */

const { randomUUID } = require("crypto");
const pool = require("../config/dbConfig");


// ---------------------------------------------
// Find user by email
// ---------------------------------------------
//
// Used before registration to determine whether
// an account with the given email already exists.
//
// @param {string} email
// @returns {Object|null}
//
async function findByEmail(email) {

    const query = `
        SELECT *
        FROM public.users
        WHERE email = $1
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}


// ---------------------------------------------
// Create user
// ---------------------------------------------
//
// Creates a new user in the database.
//
// @param {Object} userData
// @param {string} userData.first_name
// @param {string} userData.last_name
// @param {string} userData.phone
// @param {string} userData.email
// @param {string} userData.hash_key
// @param {string} userData.user_type
// @param {boolean} userData.is_verified
//
// @returns {Object}
//
async function createUser(userData) {

    const {
        first_name,
        last_name,
        phone,
        email,
        hash_key,
        user_type,
        is_verified
    } = userData;

    const user_id = randomUUID();

    const query = `
        INSERT INTO public.users (
            user_id,
            first_name,
            last_name,
            phone,
            email,
            hash_key,
            user_type,
            is_verified
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;

    const values = [
        user_id,
        first_name,
        last_name,
        phone,
        email,
        hash_key,
        user_type,
        is_verified
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
}


// ---------------------------------------------
// Save OTP
// ---------------------------------------------
//
// Stores the OTP generated during registration.
//
// @param {string} email
// @param {string} code
// @returns {void}
//
async function saveOTP(email, code) {

    const query = `
        INSERT INTO public.otp_checker (
            email,
            otp_hash,
            expires_at,
            is_used
        )
        VALUES (
            $1,
            $2,
            CURRENT_TIMESTAMP + INTERVAL '5 minutes',
            false
        )
        ON CONFLICT (email)
        DO UPDATE SET
            otp_hash = EXCLUDED.otp_hash,
            issued_at = CURRENT_TIMESTAMP,
            expires_at = CURRENT_TIMESTAMP + INTERVAL '5 minutes',
            is_used = false
    `;

    await pool.query(query, [email, code]);
}

// ---------------------------------------------
// Find OTP
// ---------------------------------------------
//
// Retrieves the OTP record for an email.
//
// @param {string} email
// @returns {Object|null}
//
async function findOTP(email) {

    const query = `
        SELECT *
        FROM public.otp_checker
        WHERE email = $1
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}

// ---------------------------------------------
// Mark OTP as used
// ---------------------------------------------
//
// Marks the OTP as used after successful verification.
//
// @param {string} email
// @returns {void}
//
async function markOTPUsed(email) {

    const query = `
        UPDATE public.otp_checker
        SET is_used = true
        WHERE email = $1
    `;

    await pool.query(query, [email]);
}


// ---------------------------------------------
// Verify user
// ---------------------------------------------
//
// Marks the user's email as verified.
//
// @param {string} email
// @returns {Object|null}
//
async function verifyUser(email) {

    const query = `
        UPDATE public.users
        SET
            is_verified = true,
            updated_at = CURRENT_TIMESTAMP
        WHERE email = $1
        RETURNING *
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
}

// ---------------------------------------------
// Delete pending registration
// ---------------------------------------------
//
// Removes the user and OTP if registration fails
// before email verification is completed.
//
// @param {string} email
// @returns {void}
//
async function deletePendingRegistration(email) {

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Delete OTP first
        await client.query(
            `DELETE FROM public.otp_checker
             WHERE email = $1`,
            [email]
        );

        // Delete only unverified user
        await client.query(
            `DELETE FROM public.users
             WHERE email = $1
             AND is_verified = false`,
            [email]
        );

        await client.query("COMMIT");

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();
    }
}


// ---------------------------------------------
// Module exports
// ---------------------------------------------
module.exports = {
    findByEmail,
    createUser,
    saveOTP,
    findOTP,
    markOTPUsed,
    verifyUser,
    deletePendingRegistration
};

