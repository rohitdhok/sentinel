require("dotenv").config({path: "../.env"});
const alertRoutes = require("./routes/alertRoutes");
const eventRoutes = require("./routes/eventRoutes");

const PORT = 3000;
const express = require("express");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/alerts", alertRoutes);
app.use("/events", eventRoutes);

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);

    return res.status(err.status || 500).json({
        message: err.status === 400
            ? err.message
            : "Internal Server Error"
    });
});

// Server setup
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
})