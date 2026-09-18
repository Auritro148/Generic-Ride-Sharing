//imports
const pool = require("../config/dbConfig");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const env = require('dotenv');
const path = require("path");

env.config({
    path: path.join(__dirname, "../.env")
});




async function validateLogin(req, res) {
    try {
        const { email, password } = req.body;

        // any code below this line must be moved to a helper function
        const query_val = {
            text:  "SELECT email, hash_key FROM users WHERE email = $1",
            values: [email],
        }

        const user = await pool.query(query_val);



        // the promise is resolved

        if (user.rowCount == 0 ) {
            return res.status(401).json({
                message: "invalid credentials"
            })
        }
        

    

        const isMatch = await bcrypt.compare(password, user.rows[0].hash_key);



        if (!isMatch) {
            return res.status(401).json({
                message: "invalid credentials"
            })
        }



        const payload = {
            id: user.rows[0].email,

            status: true,
        }

        const token = jwt.sign(payload,
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1h",
                algorithm: "HS256",
                issuer: "core/user/login",
            }
        );



        return res.json({
            token}
        )


    } catch (err) {

        console.log(err)
        res.status(500).json({
            message: "unsuccess"
        })
    }
}


module.exports = { validateLogin };