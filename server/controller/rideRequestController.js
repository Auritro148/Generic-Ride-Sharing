/*
 * rideRequestController.js
 *
 * Handles creation of ride requests.
 */

const rideRequestModel = require("../models/rideRequestModel");

const fareCalculator = require("../services/fareCalculator");


// ---------------------------------------------
// Create ride request
// ---------------------------------------------
//
// POST /ride-request
//
// Passenger identity comes from:
// JWT → req.user.email → users → passengers
//
async function createRideRequest(req, res) {

    try {

        // -----------------------------------------
        // Get authenticated user's email
        // -----------------------------------------

        const email = req.user.id;


        if (!email) {

            return res.status(401).json({
                message: "User email not found in authentication token"
            });

        }


        // -----------------------------------------
        // Get request payload
        // -----------------------------------------

        const {
            pickup,
            dropoff,
            distance,
            vehicleType,
            coupon,
            couponDiscount
        } = req.body;


        // -----------------------------------------
        // Basic payload validation
        // -----------------------------------------

        if (!pickup || !dropoff || !vehicleType) {

            return res.status(400).json({
                message: "pickup, dropoff and vehicleType are required"
            });

        }


        if (
            pickup.latitude === undefined ||
            pickup.longitude === undefined ||
            dropoff.latitude === undefined ||
            dropoff.longitude === undefined
        ) {

            return res.status(400).json({
                message: "Pickup and dropoff coordinates are required"
            });

        }


        // -----------------------------------------
        // Find passenger
        // -----------------------------------------

        const passenger =
            await rideRequestModel.findPassengerByEmail(email);


        if (!passenger) {

            return res.status(404).json({
                message: "Passenger not found"
            });

        }


        // -----------------------------------------
        // Find vehicle type
        // -----------------------------------------

        const vehicle =
            await rideRequestModel.findVehicleType(vehicleType);


        if (!vehicle) {

            return res.status(404).json({
                message: "Vehicle type not found"
            });

        }


        // -----------------------------------------
        // Determine seats from vehicle capacity
        // -----------------------------------------

        const seats = vehicle.capacity;


        // -----------------------------------------
        // Calculate estimated fare
        // -----------------------------------------
        //
        // Client estimatedFare is deliberately ignored.
        //
        // The calculation logic lives in a separate
        // service and can later be reused by a
        // dedicated fare-calculation API endpoint.
        //

        const estimatedFare =
            await fareCalculator.calculateFare({
                distance,
                vehicleType: vehicle.model_name,
                coupon,
                couponDiscount
            });


        // -----------------------------------------
        // Create ride request
        // -----------------------------------------

        const result =
            await rideRequestModel.createRideRequest({

                passenger_id: passenger.passenger_id,

                seats,

                vehicle_type_id: vehicle.type_id,

                est_fare: estimatedFare,

                pickup,

                dropoff

            });


        // -----------------------------------------
        // Response
        // -----------------------------------------

        return res.status(201).json({

            message: "Ride request created successfully",

            request: result.request,

            location: result.location

        });


    } catch (error) {

        console.error("Ride request creation error:", error);

        return res.status(500).json({
            message: "Failed to create ride request"
        });

    }
}


module.exports = {
    createRideRequest
};