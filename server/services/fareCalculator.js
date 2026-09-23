/*
 * fareCalculator.js
 *
 * Contains the estimated fare calculation logic.
 */

const VEHICLE_RATES = {
    BIKE: {
        baseFare: 50,
        perKm: 15
    },

    CNG: {
        baseFare: 70,
        perKm: 18
    },

    CAR: {
        baseFare: 100,
        perKm: 25
    },

    CARXL: {
        baseFare: 200,
        perKm: 35
    }
};


/**
 * Calculate fare for a vehicle.
 *
 * @param {Object} params
 * @param {number} params.distance
 * @param {string} params.vehicleType
 * @param {string|null} params.coupon
 * @param {number} params.couponDiscount
 *
 * @returns {Promise<number>}
 */
async function calculateFare({
    distance,
    vehicleType,
    coupon = null,
    couponDiscount = 0
}) {

    // Validate distance
    const parsedDistance = Number(distance);

    if (
        !Number.isFinite(parsedDistance) ||
        parsedDistance <= 0
    ) {
        throw new Error("Invalid distance");
    }


    // Normalize vehicle type
    const type = String(
        vehicleType || ""
    ).trim().toUpperCase();


    // Check vehicle type
    const rate = VEHICLE_RATES[type];

    if (!rate) {
        throw new Error(
            `Unsupported vehicle type: ${type}`
        );
    }


    /*
     * -----------------------------------------
     * BASE FARE CALCULATION
     * -----------------------------------------
     */

    const baseFare = rate.baseFare;

    const distanceFare =
        parsedDistance * rate.perKm;

    let fare =
        baseFare + distanceFare;


    /*
     * -----------------------------------------
     * COUPON DISCOUNT
     * -----------------------------------------
     */

    const discount =
        Number(couponDiscount) || 0;


    if (discount > 0) {
        fare -= discount;
    }


    /*
     * Fare should never be negative.
     */

    fare = Math.max(0, fare);


    /*
     * Round to 2 decimal places.
     */

    fare =
        Math.round(fare * 100) / 100;


    return fare;
}


/**
 * Calculate fares for all vehicle types.
 *
 * This is useful for the fare API because the
 * frontend wants to display multiple vehicle fares.
 */
async function calculateAllFares({
    distance,
    coupon = null,
    couponDiscount = 0
}) {

    const fares = [];

    for (const vehicleType of Object.keys(VEHICLE_RATES)) {

        const rate =
            VEHICLE_RATES[vehicleType];

        const fare =
            await calculateFare({
                distance,
                vehicleType,
                coupon,
                couponDiscount
            });


        fares.push({
            vehicleType,

            fare,

            baseFare:
                rate.baseFare,

            perKm:
                rate.perKm,

            discount:
                Number(couponDiscount) || 0
        });
    }


    return fares;
}


module.exports = {
    calculateFare,
    calculateAllFares
};
