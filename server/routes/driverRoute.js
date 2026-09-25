const router = require("express").Router();


// necessary middleware

const auth = require("../middleware/auth");
const { addDriverId } = require("../middleware/driverIdentity");


// NECESSARY CONTROLLERS


const setDriverStatus = require("../controller/setStatusController")


//driver request routes


router.post("/setStatus",auth.varifyToken,addDriverId,setDriverStatus.setStatusController);



module.exports = router;