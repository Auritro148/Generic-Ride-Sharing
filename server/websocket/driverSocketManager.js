/*

responsibility : maintains the relationship between driverId and the corresponding WebSocket connection. It ensures that each driver has only one active WebSocket connection at a time, and provides methods to add, remove, retrieve, check, and close driver sockets.

example:
driver A → socket A
driver B → socket B
driver C → socket C

example usage:
const driverSocketManager = require("./driverSocketManager");

description of methods:
1. addDriverSocket(driverId, socket): Adds a new WebSocket connection for the specified driver. If a connection already exists for that driver, it closes the previous connection before adding the new one.
2. removeDriverSocket(driverId, socket): Removes the WebSocket connection for the specified driver if it matches the provided socket.
3. getDriverSocket(driverId): Retrieves the WebSocket connection for the specified driver.
4. hasDriverSocket(driverId): Checks if a WebSocket connection exists for the specified driver.
5. closeDriverSocket(driverId, reason): Closes the WebSocket connection for the specified driver with an optional reason.

*/



const WebSocket = require("ws");
const { param } = require("../routes/rideRoute");

const driverSockets = new Map();

function addDriverSocket(driverId, socket) {
    // If this driver already has a socket,
    // close the previous connection.
    const existingSocket = driverSockets.get(driverId);

    if (existingSocket && existingSocket !== socket) {
        try {
            existingSocket.close(1000, "New connection established");
        } catch (error) {
            console.error("Error closing previous driver socket:", error);
        }
    }

    driverSockets.set(driverId, socket);

    console.log(`WebSocket connected for driver: ${driverId}`);
}

function removeDriverSocket(driverId, socket) {
    const currentSocket = driverSockets.get(driverId);

    // Only remove the socket if it is still the
    // socket registered for this driver.
    if (currentSocket === socket) {
        driverSockets.delete(driverId);

        console.log(`WebSocket removed for driver: ${driverId}`);

        return true;
    }

    return false;
}

function getDriverSocket(driverId) {
    return driverSockets.get(driverId);
}

function hasDriverSocket(driverId) {
    const socket = driverSockets.get(driverId);

    return !!(
        socket &&
        socket.readyState === WebSocket.OPEN
    );
}

function closeDriverSocket(driverId, reason = "Driver went offline") {
    const socket = driverSockets.get(driverId);

    if (!socket) {
        return false;
    }

    driverSockets.delete(driverId);

    try {
        if (
            socket.readyState === WebSocket.OPEN ||
            socket.readyState === WebSocket.CONNECTING
        ) {
            socket.close(1000, reason);
        }
    } catch (error) {
        console.error("Error closing driver socket:", error);
    }

    console.log(`WebSocket closed for driver: ${driverId}`);

    return true;
}

module.exports = {
    addDriverSocket,
    removeDriverSocket,
    getDriverSocket,
    hasDriverSocket,
    closeDriverSocket
};