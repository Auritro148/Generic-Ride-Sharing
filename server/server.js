const express = require("express");
const userRoute = require("./routes/userRoutes");
const pool = require("./config/dbConfig");


const app = express();

app.use(express.json());
app.use("/core/user", userRoute);




app.listen(3000, () => {
  console.log(`running at 3000`)
});