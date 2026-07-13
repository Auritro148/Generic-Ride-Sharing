const express = require("express");
const userRoute = require("./routes/userRoutes");
const PORT = 5000;



const app = express();
app.use(express.json());

app.use("/core/user",userRoute)



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});