/*
 * driverSearchConfig.js
 *
 * Configuration for nearby driver searching.
 *
 * DRIVER_SEARCH_RADIUS_METERS:
 * Maximum distance between a driver's current
 * location and the ride pickup location.
 */

const DRIVER_SEARCH_RADIUS_METERS = Number(
    process.env.DRIVER_SEARCH_RADIUS_METERS || 5000
);


if (
    !Number.isFinite(DRIVER_SEARCH_RADIUS_METERS) ||
    DRIVER_SEARCH_RADIUS_METERS <= 0
) {
    throw new Error(
        "DRIVER_SEARCH_RADIUS_METERS must be a positive number"
    );
}


module.exports = {
    DRIVER_SEARCH_RADIUS_METERS
};