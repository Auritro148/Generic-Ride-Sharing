/*
 * fareCalculator.js
 *
 * Contains the estimated fare calculation logic.
 *
 * This function is intentionally kept separate from the
 * ride request controller so that it can later be reused
 * by a dedicated fare-calculation API endpoint.
 */


async function calculateFare({
    distance,
    vehicleType,
    coupon,
    couponDiscount
}) {

    /*
     * -------------------------------------------------
     * FARE CALCULATION LOGIC
     * -------------------------------------------------
     *
     * Implement the actual fare calculation here.
     *
     * Available inputs:
     *
     * distance       -> distance provided by client
     * vehicleType    -> vehicle type provided by client
     * coupon         -> coupon code, if provided
     * couponDiscount -> coupon discount, if provided
     *
     * Do not use estimatedFare from the client.
     *
     * The function should eventually return a numeric
     * estimated fare.
     */

    // TODO: Implement actual fare calculation logic.

    return 100;
}


module.exports = {
    calculateFare
};