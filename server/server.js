const express = require("express");
const userRoute = require("./routes/userRoutes");
const pool = require("./config/dbConfig");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: "http://127.0.0.1:5501",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json());
app.use("/core/user", userRoute);




app.listen(3000, () => {
  console.log(`running at idk`)
});