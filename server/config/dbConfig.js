
const { Pool } = require("pg");
const path = require("path");
const env = require("dotenv"); // import dotenv to load env values to processs.env(definately not an ai generated comment)


env.config({
    path: path.join(__dirname, ".env")
});;


const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

pool.query("SELECT NOW()")
    .then(result => {
        console.log("Connected to Supabase!");
        console.log("Database time:", result.rows[0].now);
    })
    .catch(error => {
        console.error("Database connection failed:");
        console.error(error);
    });


pool.query(`
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_name = 'users';
`).then(result => {
    console.log("Users table:", result.rows);
});

console.log(process.env.DB_USER);


module.exports = pool;

