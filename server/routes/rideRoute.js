const router = require("express").Router();


// necessary middleware

const auth = require("../middleware/auth");


// NECESSARY CONTROLLERS

const rideRequest = require("../controller/rideRequestController");
const fareCalculation = require("../controller/fareController");
const updatePassengerLocationController = require("../controller/updatePassengerLocationController");



//ride processing routes

router.post("/request", auth.varifyToken, rideRequest.createRideRequest);
router.post("/fare", auth.varifyToken, fareCalculation.fareCalculation);
router.post("/updatePassengerLocation", auth.varifyToken, updatePassengerLocationController.updatePassengerLocationController);



module.exports = router;