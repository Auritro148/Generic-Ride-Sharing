const {
    setDriverStatus
} = require("../models/setDriverStatus");

const {
    closeDriverSocket
} = require("../websocket/driverSocketManager");


const setStatusController = async (req, res) => {
    try {
        const driverId = req.user.driver_id;
        console.log("Driver ID from JWT:", driverId);
       

        const {
            mode,
            lat,
            long
        } = req.body;


        if (!mode) {
            return res.status(400).json({
                success: false,
                message: "mode is required"
            });
        }


        if (mode !== "online" && mode !== "offline") {
            return res.status(400).json({
                success: false,
                message: "mode must be either 'online' or 'offline'"
            });
        }


        let driver;


        if (mode === "online") {
            driver = await setDriverStatus(
                driverId,
                mode,
                lat,
                long
            );
        } else {
            driver = await setDriverStatus(
                driverId,
                mode
            );

            // Explicitly going offline should immediately
            // close the driver's WebSocket connection.
            closeDriverSocket(
                driverId,
                "Driver went offline"
            );
        }


        return res.status(200).json({
            success: true,
            message: `Driver is now ${mode}`,
            driver: {
                driver_id: driver.driver_id,
                is_online: driver.is_online
            }
        });


    } catch (error) {
        console.error(
            "Set driver status error:",
            error
        );


        if (error.message === "Driver not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }


        if (
            error.message ===
            "Latitude and longitude are required when going online"
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }


        if (
            error.message ===
            "Latitude and longitude must be numbers"
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }


        if (
            error.message === "Invalid latitude" ||
            error.message === "Invalid longitude"
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }


        return res.status(500).json({
            success: false,
            message: "Failed to update driver status"
        });
    }
};


module.exports = {
    setStatusController
};