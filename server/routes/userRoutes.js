
const router = require("express").Router();


// necessary middleware

const auth = require("../middleware/auth");


// NECESSARY CONTROLLERS

const userRoutes = require("../controller/userLoginController");

const userProfile = require("../controller/profileViewerController");

const userRegister = require("../controller/userRegisterController");

const otpVerification = require("../controller/otpVerificationController");

const { updateProfile } = require("../controller/updatePassengerProfileController");

const { verifyUserPassword } = require("../controller/verifyPasswordController");

const { updatePassword } = require("../controller/changePasswordController");


router.post("/login", userRoutes.validateLogin);

router.post("/register", userRegister.registerUser);

router.post("/verify-otp", otpVerification.verifyOTP);

router.get("/profile", auth.varifyToken, userProfile.profileData);

router.put("/profile", auth.varifyToken, updateProfile);

router.post("/verify-password",auth.varifyToken, verifyUserPassword);

router.put("/change-password",auth.varifyToken, updatePassword);



module.exports = router;

