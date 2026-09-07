const bcrypt = require("bcryptjs");

const userModel = require("../models/userModel");


// Verify registration OTP
async function verifyOTP(req, res) {

    try {

        const { email, otp } = req.body;


        // 1. Validate input
        if (!email || !otp) {

            return res.status(400).json({
                message: "Email and OTP are required",
                verificationStatus: "failed"
            });

        }


        // 2. Normalize email
        const normalizedEmail = email.trim().toLowerCase();


        // 3. Find OTP
        const otpRecord = await userModel.findOTP(normalizedEmail);

        if (!otpRecord) {

            return res.status(400).json({
                message: "OTP not found",
                verificationStatus: "failed"
            });

        }


        // 4. Check whether OTP was already used
        if (otpRecord.is_used) {

            return res.status(400).json({
                message: "OTP has already been used",
                verificationStatus: "failed"
            });

        }


        // 5. Check OTP expiration
        if (new Date() > new Date(otpRecord.expires_at)) {

            return res.status(400).json({
                message: "OTP has expired",
                verificationStatus: "failed"
            });

        }


        // 6. Compare submitted OTP with stored hash
        const otpMatch = await bcrypt.compare(
            otp.toString(),
            otpRecord.otp_hash
        );

        if (!otpMatch) {

            return res.status(400).json({
                message: "Invalid OTP",
                verificationStatus: "failed"
            });

        }


        // 7. Mark OTP as used
        await userModel.markOTPUsed(normalizedEmail);


        // 8. Verify user
        const user = await userModel.verifyUser(normalizedEmail);


        // 9. Make sure user exists
        if (!user) {

            return res.status(404).json({
                message: "User not found",
                verificationStatus: "failed"
            });

        }


        // 10. Success
        return res.status(200).json({
            message: "Email verified successfully",
            verificationStatus: "success",
            user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                email: user.email,
                user_type: user.user_type,
                is_verified: user.is_verified
            }
        });

    } catch (error) {

        console.error("OTP verification error:", error);

        return res.status(500).json({
            message: "OTP verification failed",
            verificationStatus: "failed"
        });

    }
}


module.exports = {
    verifyOTP
};