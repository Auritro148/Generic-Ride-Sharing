
const router = require("express").Router();


// necessary middleware

const auth = require("../middleware/auth");

const { addDriverId } = require("../middleware/driverIdentity");


// NECESSARY CONTROLLERS

const setDriverStatus = require("../controller/setStatusController");


// driver request routes

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

