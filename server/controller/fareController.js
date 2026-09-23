const {
    calculateAllFares
} = require("../services/fareCalculator.js");


async function fareCalculation(req, res) {

    try {

        const {
            distance,
            couponCode
        } = req.body;


        /*
         * -----------------------------------------
         * VALIDATE DISTANCE
         * -----------------------------------------
         */

        if (
            distance === undefined ||
            distance === null ||
            distance === ""
        ) {

            return res.status(400).json({
                message: "Distance is required"
            });

        }


        const parsedDistance =
            Number(distance);


        if (
            !Number.isFinite(parsedDistance) ||
            parsedDistance <= 0
        ) {

            return res.status(400).json({
                message: "Distance must be a valid number greater than 0"
            });

        }


        /*
         * -----------------------------------------
         * COUPON
         * -----------------------------------------
         *
         * For now, no discount is applied directly
         * from the client.
         *
         * Later you can find the coupon in your
         * database and calculate its discount here.
         */

        const coupon =
            couponCode?.trim() || null;


        let couponDiscount = 0;


        /*
         * -----------------------------------------
         * CALCULATE ALL FARES
         * -----------------------------------------
         */

        const fares =
            await calculateAllFares({
                distance: parsedDistance,
                coupon,
                couponDiscount
            });


        /*
         * -----------------------------------------
         * RESPONSE
         * -----------------------------------------
         */

        return res.status(200).json({
            fares
        });

    } catch (error) {

        console.error(
            "Fare calculation error:",
            error
        );


        return res.status(500).json({
            message:
                error.message ||
                "Could not calculate fares."
        });

    }
}


module.exports = {
    fareCalculation
};