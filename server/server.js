const express = require("express");

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Express server is working!",
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});