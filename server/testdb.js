const pool = require("./config/dbConfig");

async function testDB() {
    try {
        const result = await pool.query(`
            SELECT 
                current_database() AS database,
                current_user AS user,
                inet_server_addr() AS server_ip,
                inet_server_port() AS server_port
        `);

        console.log("DATABASE CONNECTION SUCCESSFUL");
        console.log(result.rows[0]);

    } catch (err) {
        console.error("DATABASE CONNECTION FAILED");
        console.error(err);
    }
}

testDB();