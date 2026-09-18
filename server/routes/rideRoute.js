const router = require("express").Router();


// necessary middleware

const auth = require("../middleware/auth");


// NECESSARY CONTROLLERS

const rideRequest = require("../controller/rideRequestController");



//ride processing routes

router.post("/request", auth.varifyToken, rideRequest.createRideRequest);



module.exports = router;