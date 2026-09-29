const pool = require("../config/dbConfig");
const bcrypt = require("bcryptjs");


async function changePassword(
    email,
    oldPassword,
    newPassword
) {

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
            oldPassword,
            user.rows[0].hash_key
        );

    if (!isMatch) {
        return false;
    }

    const newHash =
        await bcrypt.hash(
            newPassword,
            12
        );

    const update_query = {
        text: `
            UPDATE users
            SET
                hash_key = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE email = $2
        `,
        values: [
            newHash,
            email
        ]
    };

    await pool.query(update_query);

    return true;
}


module.exports = {
    changePassword
};