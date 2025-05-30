import axios from "axios";

const api = axios.create({
  baseURL: "https://todo-app-mern-jcxy.onrender.com/api",
});

export const todoAPI = {
  getAllTodos: () => api.get("/todos"),

  getTodoById: (id) => api.get(`/todos/${id}`),

  createTodo: (todoData) => api.post("/todos", todoData),

  updateTodo: (id, todoData) => api.put(`/todos/${id}`, todoData),

  deleteTodo: (id) => api.delete(`/todos/${id}`),

  toggleTodo: (id) => api.patch(`/todos/${id}/toggle/`),
};
