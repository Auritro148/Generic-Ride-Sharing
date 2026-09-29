const router = require("express").Router();


// necessary middleware

const auth = require("../middleware/auth");


// NECESSARY CONTROLLERS

const rideRequest = require("../controller/rideRequestController");
const fareCalculation = require("../controller/fareController");
const updatePassengerLocationController = require("../controller/updatePassengerLocationController");
const {
    updatePassengerLocationController
} =
    require("../controllers/updatePassengerLocationController");

const {
    passengerRideStatusController
} =
    require("../controllers/passengerRideStatusController");



//ride processing routes

router.post("/request", auth.varifyToken, rideRequest.createRideRequest);
router.post("/fare", auth.varifyToken, fareCalculation.fareCalculation);
router.post("/updatePassengerLocation", auth.varifyToken, updatePassengerLocationController.updatePassengerLocationController);

router.get(
    "/ride-status",
    auth.varifyToken,
    passengerRideStatusController
);

module.exports = router;