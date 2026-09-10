const pool = require("../config/dbConfig");
const bcrypt = require("bcryptjs")

const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const result = await pool.query(
            `SELECT id, otp, otp_expires_at
             FROM users
             WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = result.rows[0]; }catch{} }

  /*    
        if (user.otp !== otp  bcrypt.compare(otp)) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
       
        if (new Date() > new Date(user.otp_expires_at)) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        await pool.query(
            `UPDATE users
             SET email_verified = TRUE,
                 otp = NULL,
                 otp_expires_at = NULL
             WHERE id = $1`,
            [user.id]
        );

        return res.status(200).json({
            message: "Email verified successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Email verification failed"
        });
    }
};

module.exports = {
    verifyEmail
};
*/