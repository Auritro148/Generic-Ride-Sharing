const pool = require("../config/dbConfig");
const bcrypt = require('bcryptjs');
const otp = require("../services/codeGenerator");
const { sendEmail } = require("../services/mailService");



// this is one the core apis that bridges user info and database .
//Any info passed to this api must be checked for vulnerability before writing down in database 


async function registerUser(req, res) {
    try {
        const { first_name, last_name, phone, email, password } = req.body;

        //will be moved to db models
        const query = `
    INSERT INTO users (first_name,last_name,phone , email,hash_key,user_type,is_varified)
    VALUES ($1, $2,$3,$4,$5,$6,$7)
    RETURNING *;
`;


        const userMail = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userMail.rows.length > 0) {
            return res.status(400).json({
                message: 'User exists',
                uniqueUser: false

            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const values = [first_name, last_name, phone, email, hashedPassword, 'passeger', false];

        const result = await pool.query(query, values);

        const user = result.rows[0]; // fetched the newly created user


        //sendOTP()

        const code = otp.generateOTP() ;

        await sendEmail(email , "Email Verification OTP", "your one time passcode " + code);

        //store otp against this mail in database 


        res.status(201).json({
            message: "Registration successfull , OTP sent to mail for varification",
            regStatus: "success",
            user,
            varification: "pending"
        })




    } catch (error) {

        res.status(500).json({
            message: "Registration failed"
        });

    }
}

module.exports = { registerUser };