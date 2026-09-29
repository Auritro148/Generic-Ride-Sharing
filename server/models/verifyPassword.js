const pool = require("../config/dbConfig");
const bcrypt = require("bcryptjs");


async function verifyPassword(email, password) {

    const query_val = {
        text: `
            SELECT email, hash_key
            FROM users
            WHERE email = $1
        `,
        values: [email]
    };

    const user =
        await pool.query(query_val);

    if (user.rowCount === 0) {
        return false;
    }

    const isMatch =
        await bcrypt.compare(
            password,
            user.rows[0].hash_key
        );

    return isMatch;
}


module.exports = {
    verifyPassword
};