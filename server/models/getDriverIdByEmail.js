const pool = require("../config/dbConfig");

async function getDriverIdByEmail(email) {
    const result = await pool.query(
        `
        SELECT user_id
        FROM users
        WHERE email = $1
        `,
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error("User not found");
    }

    return result.rows[0].user_id;
}

module.exports = {
    getDriverIdByEmail
};