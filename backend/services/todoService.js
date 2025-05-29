const Todo = require("../models/Todo");

async function getAllTodos() {
  return await Todo.find();
}

async function getTodoById(id) {
  const todo = await Todo.findById(id);

  if (!todo) {
    throw new Error("could not find todo");
  }

  return todo;
}

async function createTodo(todoData) {
  const todo = new Todo(todoData);
  return await todo.save();
}

async function updateTodo(id, updateData) {
  const todo = await Todo.findByIdAndUpdate(id, updateData, { new: true });
  if (!todo) {
    throw new Error("cannot update todo");
  }
  return todo;
}

async function deleteTodo(id) {
  const todo = await Todo.findByIdAndDelete(id);
  if (!todo) {
    throw new Error("could not delete todo");
  }
  return todo;
}

async function toggleStatusId(id) {
  const todo = await Todo.findById(id);
  if (!todo) {
    throw new Error("todo could not be found");
  }

  todo.completed = !todo.completed;
  return await todo.save();
}

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
};
