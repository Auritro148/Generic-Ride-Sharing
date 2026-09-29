const jwt = require("jsonwebtoken");

const {
    verifyPassword
} = require("../models/verifyPassword");


async function verifyUserPassword(req, res) {

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

        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            });
        }

        const isMatch =
            await verifyPassword(
                payload.id,
                password
            );

        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect password"
            });
        }

        return res.status(200).json({
            message: "Password verified"
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Unsuccess"
        });
    }
}


module.exports = {
    verifyUserPassword
};