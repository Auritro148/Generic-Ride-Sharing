
const router = require("express").Router();


// necessary middleware

const auth = require("../middleware/auth");


// NECESSARY CONTROLLERS

const userRoutes = require("../controller/userLoginController");

const userProfile = require("../controller/profileViewerController");

const userRegister = require("../controller/userRegisterController");


router.post("/login", userRoutes.validateLogin);

router.post("/register", userRegister.registerUser);

router.get("/profile", auth.varifyToken, userProfile.profileData);


module.exports = router;

