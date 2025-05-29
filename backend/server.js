const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

connectDB();

app.use(express.json());
app.use("/api/routes", todoRoutes);

app.listen(process.env.PORT, () => console.log("server up"));
