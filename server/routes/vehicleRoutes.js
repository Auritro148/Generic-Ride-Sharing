const router = require("express").Router();

// necessary middleware

const auth = require("../middleware/auth");

// NECESSARY CONTROLLERS

const  vehicleType = require("../controller/getVehicleTypeController");



//routers

router.get(
  "/types",
  auth.varifyToken,
  vehicleType.getVehicleTypes,
);

module.exports = router;
