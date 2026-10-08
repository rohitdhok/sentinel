require("dotenv").config({path: "../.env"});
const alertRoutes = require("./routes/alertRoutes");
const eventRoutes = require("./routes/eventRoutes");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/alerts", alertRoutes);
app.use("/events", eventRoutes);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
})