//just change the .env file as per the local dev setup
const {Pool} = require("pg");
const path = require("path");
const  _env = require("dotenv"); // import dotenv to load env values to processs.env(definately not an ai generated comment)


_env.config();


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

console.log(process.env.DB_USER)


module.exports = pool;

