const pool = require("../config/dbConfig");

async function getTypes() {

    const query = `
        SELECT
            type_id AS id,
            model_name AS name,
            base_fare,
            capacity,
            type
        FROM public.vehicle_types
        ORDER BY type_id
    `;

    const result = await pool.query(query);

    return result.rows;
}

module.exports = {
    getTypes
};