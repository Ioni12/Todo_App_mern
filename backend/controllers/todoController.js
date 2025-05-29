const todoService = require("../services/todoService");

async function getAllTodos(req, res) {
  try {
    const todos = await todoService.getAllTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "could not get all todos" });
  }
}

async function getTodoById(req, res) {
  try {
    const todo = await todoService.getTodoById(req.params.id);
    res.json(todo);
  } catch (error) {
    res.status(404).json({ message: "could not send todo" });
  }
}

async function createTodo(req, res) {
  try {
    const todo = await todoService.createTodo(req.body);
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: "could not create todo" });
  }
}

async function updateTodo(req, res) {
  try {
    const todo = await todoService.updateTodo(req.params.id, req.body);
    res.json(todo);
  } catch (error) {
    res.status(404).json({ message: "could not delete todo" });
  }
}

async function deleteTodo(req, res) {
  try {
    await todoService.deleteTodo(req.params.id);
    res.json({ message: "todo was deleted successfuly" });
  } catch (error) {
    res.status(404).json({ message: "the todo was unable to be deleted" });
  }
}

async function toggleTodoStatus(req, res) {
  try {
    const todo = await todoService.toggleTodoStatus(req.params.id);
    res.json(todo);
  } catch (error) {
    res.status(404).json({ message: "action unable" });
  }
}

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
};
