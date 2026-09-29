const jwt = require("jsonwebtoken");

const {
    updateUserProfile
} = require("../models/updatePassengerProfile");


async function updateProfile(req, res) {

    try {

        const Header =
            req.headers.authorization || '';

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


        const allowedFields = [
            "first_name",
            "last_name",
            "phone",
            "email"
        ];


        const fields = {};


        for (const field of allowedFields) {

            if (
                Object.prototype.hasOwnProperty.call(
                    req.body,
                    field
                )
            ) {

                fields[field] =
                    req.body[field];

            }

        }


        if (
            Object.keys(fields).length === 0
        ) {

            return res.status(400).json({
                message: "No valid fields to update"
            });

        }


        const updatedUser =
            await updateUserProfile(
                payload.id,
                fields
            );


        if (!updatedUser) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        return res.status(200).json({

            message:
                "Profile updated successfully",

            user: updatedUser

        });

    } catch (error) {

        console.error(
            "Update profile error:",
            error
        );


        return res.status(500).json({
            message:
                "Internal server error"
        });

    }

}


module.exports = {
    updateProfile
};