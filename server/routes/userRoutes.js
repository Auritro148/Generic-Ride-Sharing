const router = require("express").Router() ;



//necessary middleware

const auth = require("../middleware/auth");


//NECESSARY CONTROLLERS
const userRoutes = require("../controller/userLoginController");
const userProfile = require("../controller/profileViewerController");

router.post("/login",userRoutes.validateLogin);
router.get("/profile",auth.varifyToken,userProfile.profileData);


module.exports = router ;