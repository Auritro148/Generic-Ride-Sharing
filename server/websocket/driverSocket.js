/*

responsible for handling WebSocket connections for drivers. It verifies the JWT token, manages driver socket connections, and handles disconnections with a grace period before marking the driver offline.

##workflow:
1. When a driver connects, the server verifies the JWT token to authenticate the driver.
2. If authentication is successful, the driver's WebSocket connection is added to the driverSockets map.
3. The server listens for messages from the driver, including ping/pong messages to keep the connection alive.
4. If the driver disconnects, a grace period timer is started. If the driver does not reconnect within this period, they are automatically marked offline.
5. The server periodically checks if each WebSocket connection is alive and terminates any that are not responding.




*/



const jwt = require("jsonwebtoken");
const WebSocket = require("ws");

const {
    addDriverSocket,
    removeDriverSocket
} = require("./driverSocketManager");

const {
    setDriverOffline
} = require("../models/setDriverStatus");

const DISCONNECT_GRACE_PERIOD = 30000;

function verifyDriverToken(token) {
    if (!token) {
        throw new Error("WebSocket authentication token missing");
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
    );

    // if (!decoded.driver_id) {
    //     throw new Error("driver_id missing from token");
    // }

    return decoded;
}

function setupDriverWebSocket(wss) {
    wss.on("connection", async (socket, request) => {
        let driverId = null;
        let disconnectTimer = null;
        let isAlive = true;

        try {
            const requestUrl = new URL(
                request.url,
                `http://${request.headers.host}`
            );

            const token = requestUrl.searchParams.get("token");

            const decoded = verifyDriverToken(token);

            driverId = '850fc4f4-5e5a-48c3-bae8-36df65778f35';

            addDriverSocket(driverId, socket);

            socket.isAlive = true;

            socket.on("pong", () => {
                socket.isAlive = true;
            });

            socket.on("message", (message) => {
                try {
                    const data = JSON.parse(message.toString());

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

            socket.on("close", () => {
                if (disconnectTimer) {
                    clearTimeout(disconnectTimer);
                }

                const removed = removeDriverSocket(
                    driverId,
                    socket
                );

                if (!removed) {
                    return;
                }

                console.log(
                    `Driver ${driverId} disconnected. Starting grace period.`
                );

                disconnectTimer = setTimeout(async () => {
                    try {
                        const offlineResult =
                            await setDriverOffline(driverId);

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
                }, DISCONNECT_GRACE_PERIOD);
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

    console.log("Driver WebSocket server initialized");
}

module.exports = {
    setupDriverWebSocket
};