const bcrypt = require("bcryptjs");

const otpService = require("../services/codeGenerator");
const { sendEmail } = require("../services/mailService");

// Database/model layer
const userModel = require("../models/userModel");


// ======================================================
// REGISTER USER
// ======================================================

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

        const hashedPassword = await bcrypt.hash(
            password,
            12
        );


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
        // 8. Save OTP in separate OTP table
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

        console.error(
            "Registration error:",
            error
        );


        // -----------------------------------
        // Clean up failed registration
        // -----------------------------------

        if (email) {

            try {

                // Delete OTP if it was created
                await userModel.deleteOTP(email);

            } catch (cleanupError) {

                console.error(
                    "OTP cleanup failed:",
                    cleanupError
                );
            }


            try {

                // Delete user if registration failed
                await userModel.deletePendingRegistration(email);

            } catch (cleanupError) {

                console.error(
                    "Registration cleanup failed:",
                    cleanupError
                );
            }
        }


        // -----------------------------------
        // Duplicate email
        // -----------------------------------

        if (error.code === "23505") {

            return res.status(400).json({

                message: "User exists",

                uniqueUser: false,

                regStatus: "failed"
            });
        }


        // -----------------------------------
        // Generic error
        // -----------------------------------

        return res.status(500).json({

            message: "Registration failed",

            regStatus: "failed"
        });
    }
}



// ======================================================
// VERIFY OTP
// ======================================================

async function verifyOTP(req, res) {

    try {

        const {
            email: rawEmail,
            otp
        } = req.body;


        // -----------------------------------
        // 1. Validate input
        // -----------------------------------

        if (!rawEmail || !otp) {

            return res.status(400).json({

                message: "Email and OTP are required",

                verified: false
            });
        }


        // -----------------------------------
        // 2. Normalize email
        // -----------------------------------

        const email = rawEmail
            .trim()
            .toLowerCase();


        // -----------------------------------
        // 3. Check user
        // -----------------------------------

        const user = await userModel.findByEmail(email);


        if (!user) {

            return res.status(404).json({

                message: "User not found",

                verified: false
            });
        }


        // -----------------------------------
        // 4. Check if already verified
        // -----------------------------------

        if (user.is_verified === true) {

            return res.status(400).json({

                message: "Email is already verified",

                verified: true
            });
        }


        // -----------------------------------
        // 5. Get OTP information
        // -----------------------------------

        const otpData =
            await userModel.getOTP(email);


        if (!otpData) {

            return res.status(400).json({

                message: "OTP not found",

                verified: false
            });
        }


        // -----------------------------------
        // 6. Check if OTP was already used
        // -----------------------------------

        if (otpData.is_used === true) {

            return res.status(400).json({

                message: "OTP has already been used",

                verified: false
            });
        }


        // -----------------------------------
        // 7. Check OTP expiration
        // -----------------------------------

        const currentTime = new Date();

        const expiresAt =
            new Date(otpData.expires_at);


        if (currentTime > expiresAt) {

            // Delete expired OTP
            await userModel.deleteOTP(email);


            return res.status(400).json({

                message: "OTP has expired. Please request a new OTP.",

                verified: false
            });
        }


        // -----------------------------------
        // 8. Compare OTP
        // -----------------------------------

        const isValidOTP =
            await bcrypt.compare(
                otp.toString().trim(),
                otpData.otp_hash
            );


        // -----------------------------------
        // 9. Invalid OTP
        // -----------------------------------

        if (!isValidOTP) {

            return res.status(400).json({

                message: "Invalid OTP",

                verified: false
            });
        }


        // -----------------------------------
        // 10. Set user as verified
        // -----------------------------------

        await userModel.verifyUser(email);


        // -----------------------------------
        // 11. Delete OTP
        // -----------------------------------

        await userModel.deleteOTP(email);


        // -----------------------------------
        // 12. Success
        // -----------------------------------

        return res.status(200).json({

            message: "Email verified successfully",

            verified: true
        });


    } catch (error) {

        console.error(
            "OTP verification error:",
            error
        );


        return res.status(500).json({

            message: "OTP verification failed",

            verified: false
        });
    }
}

// ======================================================
// RESEND OTP
// ======================================================

async function resendOTP(req, res) {

    try {

        const {
            email: rawEmail
        } = req.body;


        // -----------------------------------
        // 1. Validate email
        // -----------------------------------

        if (!rawEmail) {

            return res.status(400).json({

                message: "Email is required",

                resendStatus: "failed"
            });
        }


        // -----------------------------------
        // 2. Normalize email
        // -----------------------------------

        const email = rawEmail
            .trim()
            .toLowerCase();


        // -----------------------------------
        // 3. Check user
        // -----------------------------------

        const user =
            await userModel.findByEmail(email);


        if (!user) {

            return res.status(404).json({

                message: "User not found",

                resendStatus: "failed"
            });
        }


        // -----------------------------------
        // 4. Check verification status
        // -----------------------------------

        if (user.is_verified === true) {

            return res.status(400).json({

                message: "Email is already verified",

                resendStatus: "failed"
            });
        }


        // -----------------------------------
        // 5. Get existing OTP
        // -----------------------------------

        const existingOTP =
            await userModel.getOTPInfo(email);


        if (existingOTP) {

            const issuedAt =
                new Date(existingOTP.issued_at);

            const currentTime =
                new Date();


            const elapsedTime =
                currentTime.getTime() -
                issuedAt.getTime();


            // 5 minutes
            const FIVE_MINUTES =
                5 * 60 * 1000;


            // -----------------------------------
            // 6. Check resend limit
            // -----------------------------------

            if (elapsedTime < FIVE_MINUTES) {

                const remainingTime =
                    FIVE_MINUTES - elapsedTime;


                const remainingSeconds =
                    Math.ceil(
                        remainingTime / 1000
                    );


                return res.status(429).json({

                    message:
                        `Please wait ${remainingSeconds} seconds before requesting another OTP`,

                    resendStatus: "failed",

                    retryAfter: remainingSeconds
                });
            }


            // -----------------------------------
            // 7. Delete old OTP
            // -----------------------------------

            await userModel.deleteOTP(email);
        }


        // -----------------------------------
        // 8. Generate new OTP
        // -----------------------------------

        const code =
            otpService.generateOTP();


        // -----------------------------------
        // 9. Hash new OTP
        // -----------------------------------

        const hashedOTP =
            await bcrypt.hash(
                code.toString(),
                12
            );


        // -----------------------------------
        // 10. Save new OTP
        // -----------------------------------

        await userModel.saveOTP(
            email,
            hashedOTP
        );


        // -----------------------------------
        // 11. Send new OTP
        // -----------------------------------

        await sendEmail(

            email,

            "New Email Verification OTP",

            `Your new one time passcode is ${code}`
        );


        // -----------------------------------
        // 12. Response
        // -----------------------------------

        return res.status(200).json({

            message:
                "A new OTP has been sent to your email",

            resendStatus: "success"
        });


    } catch (error) {

        console.error(
            "Resend OTP error:",
            error
        );


        return res.status(500).json({

            message: "Failed to resend OTP",

            resendStatus: "failed"
        });
    }
}


module.exports = {

    registerUser,

    verifyOTP,

    resendOTP
};