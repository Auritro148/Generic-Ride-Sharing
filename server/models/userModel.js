const pool = require("../config/dbConfig");



// ======================================================
// FIND USER BY EMAIL
// ======================================================

async function findByEmail(email) {

    const result = await pool.query(
        `
        SELECT
            user_id,
            first_name,
            last_name,
            phone,
            email,
            hash_key,
            user_type,
            is_verified
        FROM users
        WHERE email = $1
        `,
        [email]
    );


    if (result.rows.length === 0) {

        return null;
    }


    return result.rows[0];
}



// ======================================================
// CREATE USER
// ======================================================

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


    const result = await pool.query(
        `
        INSERT INTO users
        (
            first_name,
            last_name,
            phone,
            email,
            hash_key,
            user_type,
            is_verified
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
        )
        RETURNING
            user_id,
            first_name,
            last_name,
            phone,
            email,
            user_type,
            is_verified
        `,
        [
            first_name,
            last_name,
            phone,
            email,
            hash_key,
            user_type,
            is_verified
        ]
    );


    return result.rows[0];
}



// ======================================================
// SAVE OTP
// ======================================================

async function saveOTP(email, hashedOTP) {

    await pool.query(
        `
        INSERT INTO otp_checker
        (
            email,
            otp_hash,
            issued_at,
            expires_at,
            is_used
        )
        VALUES
        (
            $1,
            $2,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP + INTERVAL '5 minutes',
            false
        )
        `,
        [
            email,
            hashedOTP
        ]
    );
}


// ======================================================
// GET OTP
// ======================================================

async function getOTP(email) {

    const result = await pool.query(
        `
        SELECT
            otp_hash,
            expires_at,
            is_used
        FROM otp_checker
        WHERE email = $1
        `,
        [email]
    );


    if (result.rows.length === 0) {
        return null;
    }


    return result.rows[0];
}


// ======================================================
// GET OTP + CREATED TIME
// ======================================================

async function getOTPInfo(email) {

    const result = await pool.query(
        `
        SELECT
            otp_hash,
            issued_at,
            expires_at,
            is_used
        FROM otp_checker
        WHERE email = $1
        `,
        [email]
    );


    if (result.rows.length === 0) {
        return null;
    }


    return result.rows[0];
}

// ======================================================
// DELETE OTP
// ======================================================

async function deleteOTP(email) {

    await pool.query(
        `
        DELETE FROM otp_checker
        WHERE email = $1
        `,
        [email]
    );
}


// ======================================================
// VERIFY USER
// ======================================================

async function verifyUser(email) {

    const result = await pool.query(
        `
        UPDATE users
        SET is_verified = true
        WHERE email = $1
        RETURNING
            user_id,
            first_name,
            last_name,
            phone,
            email,
            user_type,
            is_verified
        `,
        [email]
    );


    if (result.rows.length === 0) {

        return null;
    }


    return result.rows[0];
}



// ======================================================
// DELETE PENDING REGISTRATION
// ======================================================

async function deletePendingRegistration(email) {

    await pool.query(
        `
        DELETE FROM users
        WHERE email = $1
        AND is_verified = false
        `,
        [email]
    );
}



// ======================================================
// EXPORT
// ======================================================

module.exports = {

    findByEmail,

    createUser,

    saveOTP,

    getOTP,

    getOTPInfo,

    deleteOTP,

    verifyUser,

    deletePendingRegistration
};