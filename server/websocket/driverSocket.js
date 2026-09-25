const jwt = require("jsonwebtoken");
const WebSocket = require("ws");

const {
    addDriverSocket,
    removeDriverSocket,
    getDriverSocket
} = require("./driverSocketManager");

const {
    setDriverOffline
} = require("../models/setDriverStatus");

const {
    addDriverId
} = require("../middleware/driverIdentity");


const DISCONNECT_GRACE_PERIOD = 30000;


/*
 * Verifies the JWT received through the
 * WebSocket connection URL.
 */
function verifyDriverToken(token) {

    if (!token) {
        throw new Error(
            "WebSocket authentication token missing"
        );
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
    );

    return decoded;
}


/*
 * Initializes the driver WebSocket server.
 */
function setupDriverWebSocket(wss) {

    wss.on("connection", async (socket, request) => {

        let driverId = null;
        let disconnectTimer = null;


        try {

            /*
             * --------------------------------
             * 1. Extract JWT from URL
             * --------------------------------
             *
             * Example:
             *
             * ws://localhost:5000/core/driver/ws?token=JWT
             */

            const requestUrl = new URL(
                request.url,
                `http://${request.headers.host}`
            );

            const token =
                requestUrl.searchParams.get("token");


            /*
             * --------------------------------
             * 2. Verify JWT
             * --------------------------------
             */

            const decoded =
                verifyDriverToken(token);


            /*
             * --------------------------------
             * 3. Find driver UUID
             * --------------------------------
             *
             * JWT contains:
             *
             * decoded.id = driver email
             *
             * addDriverId() finds the corresponding
             * driver UUID and adds:
             *
             * decoded.driver_id
             */

            await addDriverId(decoded);

            driverId =
                decoded.driver_id;


            /*
             * --------------------------------
             * 4. Register WebSocket
             * --------------------------------
             */

            addDriverSocket(
                driverId,
                socket
            );


            /*
             * --------------------------------
             * 5. WebSocket heartbeat
             * --------------------------------
             */

            socket.isAlive = true;

            socket.on("pong", () => {

                socket.isAlive = true;

            });


            /*
             * --------------------------------
             * 6. Handle client messages
             * --------------------------------
             */

            socket.on("message", (message) => {

                try {

                    const data =
                        JSON.parse(
                            message.toString()
                        );


                    /*
                     * Optional application-level
                     * ping/pong.
                     */

                    if (data.type === "ping") {

                        socket.send(
                            JSON.stringify({
                                type: "pong"
                            })
                        );

                    }

                } catch (error) {

                    console.error(
                        `Invalid WebSocket message from driver ${driverId}:`,
                        error
                    );

                }

            });


            /*
             * --------------------------------
             * 7. Handle WebSocket disconnect
             * --------------------------------
             */

            socket.on("close", () => {

                /*
                 * Remove this socket only if it
                 * is still the current socket
                 * registered for this driver.
                 */

                const removed =
                    removeDriverSocket(
                        driverId,
                        socket
                    );


                /*
                 * If false, this socket is no longer
                 * the driver's active socket.
                 *
                 * This can happen when:
                 *
                 * - a new socket replaced it
                 * - the driver intentionally went offline
                 */

                if (!removed) {

                    return;

                }


                console.log(
                    `Driver ${driverId} disconnected. Starting grace period.`
                );


                /*
                 * --------------------------------
                 * 8. Grace period
                 * --------------------------------
                 *
                 * Give the driver 30 seconds to
                 * reconnect.
                 */

                disconnectTimer =
                    setTimeout(
                        async () => {

                            try {

                                /*
                                 * Check whether the driver
                                 * established a new WebSocket
                                 * connection.
                                 */

                                const currentSocket =
                                    getDriverSocket(
                                        driverId
                                    );


                                if (currentSocket) {

                                    console.log(
                                        `Driver ${driverId} reconnected. Keeping driver online.`
                                    );

                                    return;

                                }


                                /*
                                 * Driver did not reconnect.
                                 *
                                 * Mark offline and remove
                                 * active driver location.
                                 */

                                const offlineResult =
                                    await setDriverOffline(
                                        driverId
                                    );


                                if (offlineResult) {

                                    console.log(
                                        `Driver ${driverId} automatically marked offline`
                                    );

                                }

                            } catch (error) {

                                console.error(
                                    `Failed to automatically mark driver ${driverId} offline:`,
                                    error
                                );

                            }

                        },
                        DISCONNECT_GRACE_PERIOD
                    );

            });


            socket.on("error", (error) => {

                console.error(
                    `WebSocket error for driver ${driverId}:`,
                    error
                );

            });


     

            socket.send(
                JSON.stringify({
                    type: "connection_established",
                    message: "Driver WebSocket connected",
                    driver_id: driverId
                })
            );


        } catch (error) {

            console.error(
                "WebSocket authentication failed:",
                error.message
            );


            socket.close(
                1008,
                "WebSocket authentication failed"
            );

        }

    });


    /*
     * --------------------------------
     * WebSocket heartbeat
     * --------------------------------
     *
     * Every 15 seconds the server sends
     * a WebSocket-level ping.
     *
     * If the client does not respond with
     * pong, the socket is terminated.
     *
     * The close event then starts the
     * 30-second grace period above.
     */

    setInterval(() => {

        wss.clients.forEach((socket) => {

            if (socket.isAlive === false) {

                socket.terminate();

                return;

            }

            socket.isAlive = false;

            socket.ping();

        });

    }, 15000);


    console.log(
        "Driver WebSocket server initialized"
    );
}


module.exports = {
    setupDriverWebSocket
};