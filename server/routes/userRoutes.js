const router = require("express").Router() ;


//NECESSARY CONTROLLERS
const userRoutes = require("../controller/userLoginController");

router.post("/login",userRoutes.validateLogin);



module.exports = router ;