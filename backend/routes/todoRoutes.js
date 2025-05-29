const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");

router.get("/", todoController.getAllTodos);

router.get("/:id", todoController.getTodoById);

router.post("/", todoController.createTodo);

router.put("/:id", todoController.updateTodo);

router.patch("/:id/toggle", todoController.toggleTodoStatus);

router.delete("/:id", todoController.deleteTodo);

module.exports = router;
