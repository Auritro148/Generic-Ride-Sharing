/*
responsibility:
Maintains the relationship between driverId and
the corresponding WebSocket connection.

driver A → socket A
driver B → socket B
driver C → socket C
*/

const WebSocket = require("ws");

const driverSockets = new Map();


function addDriverSocket(driverId, socket) {

    const existingSocket =
        driverSockets.get(driverId);

    /*
     * A driver can have only one active socket.
     */
    if (
        existingSocket &&
        existingSocket !== socket
    ) {

        try {

            existingSocket.close(
                1000,
                "New connection established"
            );

        } catch (error) {

            console.error(
                "Error closing previous driver socket:",
                error
            );

        }
    }

    driverSockets.set(
        driverId,
        socket
    );

    console.log(
        `WebSocket connected for driver: ${driverId}`
    );
}


function removeDriverSocket(
    driverId,
    socket
) {

    const currentSocket =
        driverSockets.get(driverId);

    /*
     * Only remove the socket if it is still
     * the socket currently registered for
     * this driver.
     */
    if (currentSocket === socket) {

        driverSockets.delete(
            driverId
        );

        console.log(
            `WebSocket removed for driver: ${driverId}`
        );

        return true;
    }

    /*
     * This usually means an old socket closed
     * after a newer socket was already registered.
     */
    return false;
}


function getDriverSocket(driverId) {

    return driverSockets.get(
        driverId
    );
}


function hasDriverSocket(driverId) {

    const socket =
        driverSockets.get(driverId);

    return !!(
        socket &&
        socket.readyState === WebSocket.OPEN
    );
}


function closeDriverSocket(
    driverId,
    reason = "Driver went offline"
) {

    const socket =
        driverSockets.get(driverId);

    if (!socket) {
        return false;
    }

    /*
     * IMPORTANT:
     *
     * Remove the socket from the map BEFORE
     * closing it.
     *
     * This makes the close event know that
     * this was an intentional close.
     */
    driverSockets.delete(
        driverId
    );

    try {

        if (
            socket.readyState === WebSocket.OPEN ||
            socket.readyState === WebSocket.CONNECTING
        ) {

            socket.close(
                1000,
                reason
            );

        }

    } catch (error) {

        console.error(
            "Error closing driver socket:",
            error
        );

    }

    console.log(
        `WebSocket closed for driver: ${driverId}`
    );

    return true;
}


module.exports = {
    addDriverSocket,
    removeDriverSocket,
    getDriverSocket,
    hasDriverSocket,
    closeDriverSocket
};