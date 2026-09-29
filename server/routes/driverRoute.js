
const router = require("express").Router();


// necessary middleware

const auth = require("../middleware/auth");

const { addDriverId } = require("../middleware/driverIdentity");


// NECESSARY CONTROLLERS

const setDriverStatus = require("../controller/setStatusController");

const {
    driverRegistrationController
} = require("../controller/driverRegistrationController");



// driver request routes

//for only signup and utils routes, we are using the same controller function driverRegistrationController. The controller function will handle the logic for both routes based on the action specified in the request body.

//"/signup" route is used for driver registration, while "/utils" route is used for checking user existence, checking driver request existence, and checking registration status. Both routes require authentication using the varifyToken middleware.
router.post(
    "/signup",
    auth.varifyToken,
    driverRegistrationController
);

router.post(
    "/utils",
    auth.varifyToken,
    driverRegistrationController
);



router.post(
    "/setStatus",
    auth.varifyToken,

    async (req, res, next) => {
        try {

            await addDriverId(req.user);

            next();

        } catch (error) {

            next(error);

        }
    },

    setDriverStatus.setStatusController
);


module.exports = router;

