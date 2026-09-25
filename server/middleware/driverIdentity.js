const {
    getDriverIdByEmail
} = require("../models/getDriverIdByEmail");

async function addDriverId(decoded) {

    if (!decoded.id) {
        throw new Error("Email missing from JWT payload");
    }

    const driverId = await getDriverIdByEmail(
        decoded.id
    );

    decoded.driver_id = driverId;

    return decoded;
}

module.exports = {
    addDriverId
};