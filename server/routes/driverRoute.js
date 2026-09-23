const router = require("express").Router();


// necessary middleware

const auth = require("../middleware/auth");


// NECESSARY CONTROLLERS


const setDriverStatus = require("../controller/setStatusController")


//driver request routes


router.post("/setStatus",auth.varifyToken,setDriverStatus.setStatusController);



module.exports = router;