const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/database");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/todos", todoRoutes);

app.listen(process.env.PORT, () => console.log("server up"));
