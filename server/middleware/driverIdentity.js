
const {
    getDriverIdByEmail
} = require("../models/getDriverIdByEmail");


async function addDriverId(decoded) {

    /*
     * The JWT stores the user's email
     * inside the "id" claim.
     *
     * Example JWT payload:
     *
     * {
     *     id: "test@gmail.com",
     *     status: true
     * }
     */

    const email = decoded.id;


    if (!email) {

        throw new Error(
            "Email missing from JWT payload"
        );

    }


    const driverId =
        await getDriverIdByEmail(email);


    decoded.driver_id = driverId;


    return decoded;
}


module.exports = {
    addDriverId
};

