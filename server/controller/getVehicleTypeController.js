
const vehicleModel = require("../models/vehicleModel");

async function getVehicleTypes(req, res) {

    try {

        const vehicles = await vehicleModel.getTypes();

        return res.status(200).json({
            vehicles: vehicles
        });

    } catch (error) {

        console.error("Vehicle type loading error:", error);

        return res.status(500).json({
            message: "Could not load vehicle types."
        });
    }
}

module.exports = {
    getVehicleTypes
};