const pool = require("../config/dbConfig");

async function updateUserProfile(userEmail, fields) {

    const allowedFields = [
        "first_name",
        "last_name",
        "phone",
        "email"
    ];

    const updateFields = [];
    const values = [];

    let index = 1;

    for (const field of allowedFields) {

        if (Object.prototype.hasOwnProperty.call(fields, field)) {

            updateFields.push(
                `${field} = $${index}`
            );

            values.push(fields[field]);

            index++;
        }
    }

    if (updateFields.length === 0) {
        return null;
    }

    values.push(userEmail);

    const query = {
        text: `
            UPDATE PUBLIC.USERS
            SET
                ${updateFields.join(", ")},
                UPDATED_AT = CURRENT_TIMESTAMP
            WHERE EMAIL = $${index}
            RETURNING
                USER_ID,
                FIRST_NAME,
                LAST_NAME,
                PHONE,
                EMAIL,
                USER_TYPE,
                IS_VERIFIED
        `,
        values: values
    };

    const result = await pool.query(query);

    return result.rows[0] || null;
}

module.exports = {
    updateUserProfile
};