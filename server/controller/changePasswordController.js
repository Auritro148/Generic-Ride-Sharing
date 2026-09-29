const jwt = require("jsonwebtoken");

const {
    changePassword
} = require("../models/changePassword");


async function updatePassword(req, res) {

    try {

        const Header =
            req.headers.authorization || "";

        const token =
            Header.split(" ").at(1);

        if (!token) {
            return res.status(401).json({
                message: "Authentication token missing"
            });
        }

        const payload =
            jwt.decode(token);

        if (!payload || !payload.id) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        const {
            old_password,
            new_password
        } = req.body;

        if (!old_password || !new_password) {
            return res.status(400).json({
                message: "Old password and new password are required"
            });
        }

        if (old_password === new_password) {
            return res.status(400).json({
                message: "New password must be different from old password"
            });
        }

        const updated =
            await changePassword(
                payload.id,
                old_password,
                new_password
            );

        if (!updated) {
            return res.status(401).json({
                message: "Incorrect old password"
            });
        }

        return res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Unsuccess"
        });
    }
}


module.exports = {
    updatePassword
};