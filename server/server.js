const express = require("express");
const http = require("http");

const cors = require("cors");

const userRoute = require("./routes/userRoutes");
const vehicleType = require("./routes/vehicleRoutes");
const rideRoute = require("./routes/rideRoute");
const driverRoute = require("./routes/driverRoute");

const WebSocket = require("ws");

const {
    setupDriverWebSocket
} = require("./websocket/driverSocket");


const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
    ],
    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ]
}));


app.use(express.json());


app.use("/core/user", userRoute);
app.use("/core/vehicles", vehicleType);
app.use("/core/rides", rideRoute);
app.use("/core/driver", driverRoute);


// Create HTTP server explicitly.
// Express routes and WebSocket connections
// will use the same server.
const server = http.createServer(app);


// Create WebSocket server without its own HTTP server.
// It will use the HTTP server created above.
const driverWss = new WebSocket.Server({
    noServer: true
});


// Accept only WebSocket requests targeting
// /core/driver/ws
server.on("upgrade", (request, socket, head) => {

    const requestUrl = new URL(
        request.url,
        `http://${request.headers.host}`
    );


    if (requestUrl.pathname !== "/core/driver/ws") {
        socket.destroy();
        return;
    }


    driverWss.handleUpgrade(
        request,
        socket,
        head,
        (ws) => {
            driverWss.emit(
                "connection",
                ws,
                request
            );
        }
    );
});


setupDriverWebSocket(driverWss);


const PORT = process.env.PORT;


server.listen(PORT, () => {
    console.log(`HTTP server running at ${PORT}`);
    console.log(
        `Driver WebSocket endpoint: ws://localhost:${PORT}/core/driver/ws`
    );
});