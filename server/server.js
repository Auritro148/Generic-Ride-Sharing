const express = require("express");
const userRoute = require("./routes/userRoutes");
const vehicleType = require("./routes/vehicleRoutes");
const rideRoute = require("./routes/rideRoute");
const pool = require("./config/dbConfig");
const cors = require("cors");


const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());
app.use("/core/user", userRoute);
app.use("/core/vehicles",vehicleType);
app.use("/core/rides",rideRoute);




app.listen(process.env.PORT, () => {
  console.log(`running at ${process.env.PORT}`)
});