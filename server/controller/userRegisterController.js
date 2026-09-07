
const bcrypt = require("bcryptjs");

const otpService = require("../services/codeGenerator");
const { sendEmail } = require("../services/mailService");

// Database/model layer
const userModel = require("../models/userModel");


// Register a new user
async function registerUser(req, res) {

    let email;

    try {

        const {
            first_name,
            last_name,
            phone,
            email: rawEmail,
            password
        } = req.body;


        // -----------------------------------
        // 1. Validate input
        // -----------------------------------

        if (
            !first_name ||
            !last_name ||
            !phone ||
            !rawEmail ||
            !password
        ) {
            return res.status(400).json({
                message: "All fields are required",
                regStatus: "failed"
            });
        }


        // -----------------------------------
        // 2. Normalize email
        // -----------------------------------

        email = rawEmail.trim().toLowerCase();


        // -----------------------------------
        // 3. Check whether user already exists
        // -----------------------------------

        const existingUser = await userModel.findByEmail(email);

        if (existingUser) {

            return res.status(400).json({
                message: "User exists",
                uniqueUser: false,
                regStatus: "failed"
            });
        }


        // -----------------------------------
        // 4. Hash password
        // -----------------------------------

        const hashedPassword = await bcrypt.hash(password, 12);


        // -----------------------------------
        // 5. Create user
        // -----------------------------------

        const userData = {
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            phone: phone.trim(),
            email,
            hash_key: hashedPassword,
            user_type: "passenger",
            is_verified: false
        };

        const user = await userModel.createUser(userData);


        // -----------------------------------
        // 6. Generate OTP
        // -----------------------------------

        const code = otpService.generateOTP();


        // -----------------------------------
        // 7. Hash OTP
        // -----------------------------------

        const hashedOTP = await bcrypt.hash(
            code.toString(),
            12
        );


        // -----------------------------------
        // 8. Store hashed OTP
        // -----------------------------------

        await userModel.saveOTP(
            email,
            hashedOTP
        );


        // -----------------------------------
        // 9. Send OTP email
        // -----------------------------------

        await sendEmail(
            email,
            "Email Verification OTP",
            `Your one time passcode is ${code}`
        );


        // -----------------------------------
        // 10. Registration response
        // -----------------------------------

        return res.status(201).json({

            message:
                "Registration successful, OTP sent to mail for verification",

            regStatus: "success",

            user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                email: user.email,
                user_type: user.user_type,
                is_verified: user.is_verified
            },

            verification: "pending"
        });


    } catch (error) {

        console.error("Registration error:", error);


        // -----------------------------------
        // 11. Clean up failed registration
        // -----------------------------------

        if (email) {

            try {

                await userModel.deletePendingRegistration(email);

            } catch (cleanupError) {

                console.error(
                    "Registration cleanup failed:",
                    cleanupError
                );
            }
        }


        // -----------------------------------
        // 12. Handle duplicate email race
        // -----------------------------------

        if (error.code === "23505") {

            return res.status(400).json({
                message: "User exists",
                uniqueUser: false,
                regStatus: "failed"
            });
        }


        // -----------------------------------
        // 13. Generic server error
        // -----------------------------------

        return res.status(500).json({
            message: "Registration failed",
            regStatus: "failed"
        });
    }
}


module.exports = {
    registerUser
};

