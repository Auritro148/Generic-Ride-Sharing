const router = require("express").Router();


// necessary middleware

const auth = require("../middleware/auth");


// NECESSARY CONTROLLERS

const rideRequest = require("../controller/rideRequestController");
const fareCalculation = require("../controller/fareController");



//ride processing routes

router.post("/request", auth.varifyToken, rideRequest.createRideRequest);
router.post("/fare", auth.varifyToken, fareCalculation.fareCalculation)



module.exports = router;