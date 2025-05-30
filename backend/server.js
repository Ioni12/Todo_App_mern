const express = require("express");
require("dotenv").config();
const connectDB = require("./config/database");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

connectDB();

app.use(express.json());
app.use("/api/routes", todoRoutes);

app.get("/api/todos", (req, res) => {
  res.json([{ id: 1, task: "Test todo", completed: false }]);
});

app.listen(process.env.PORT, () => console.log("server up"));
