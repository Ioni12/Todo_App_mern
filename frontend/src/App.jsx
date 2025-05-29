import { useEffect, useState } from "react";
import {
  Plus,
  Check,
  X,
  Moon,
  Sun,
  Calendar,
  Clock,
  FileText,
  Flag,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Mock API for demonstration - replace with your actual todoAPI
const todoAPI = {
  getAllTodos: async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      data: [
        {
          _id: "1",
          title: "Complete project documentation",
          description: "Write comprehensive docs for the new features",
          priority: "high",
          completed: false,
          createdAt: new Date("2024-01-15"),
        },
        {
          _id: "2",
          title: "Review pull requests",
          description: "",
          priority: "medium",
          completed: true,
          createdAt: new Date("2024-01-14"),
        },
      ],
    };
  },
  createTodo: async (todoData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      data: {
        ...todoData,
        _id: Date.now().toString(),
        createdAt: new Date(),
      },
    };
  },
  updateTodo: async (id, todoData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: { ...todoData, _id: id } };
  },
  deleteTodo: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  },
  toggleTodo: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      data: {
        _id: id,
        completed: Math.random() > 0.5,
        title: "Sample todo",
        priority: "medium",
      },
    };
  },
};

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const res = await todoAPI.getAllTodos();
      setTodos(res.data);
      setError("");
    } catch (error) {
      setError("Failed to load todos. Make sure backend is running!");
      console.error("Error loading todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (todoData) => {
    try {
      setIsSubmitting(true);
      const res = await todoAPI.createTodo(todoData);
      setTodos([res.data, ...todos]);
      setError("");

      // Reset form and hide it
      setTitle("");
      setDescription("");
      setPriority("medium");
      setShowForm(false);
    } catch (error) {
      setError("Failed to add todo");
      console.log(error);
      throw error; // Re-throw to handle in form
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim() && !isSubmitting) {
      const todoData = {
        title: title.trim(),
        description: description.trim(),
        priority,
      };

      await handleAddTodo(todoData);
    }
  };

  const handleUpdateTodo = async (id, todoData) => {
    try {
      const res = await todoAPI.updateTodo(id, todoData);
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
      setError("");
    } catch (error) {
      setError("Failed to update todo");
      console.log(error);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this todo?")) {
      return;
    }
    try {
      await todoAPI.deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
      setError("");
    } catch (error) {
      setError("Failed to delete todo");
      console.log(error);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const res = await todoAPI.toggleTodo(id);
      setTodos(todos.map((todo) => (todo._id === id ? res.data : todo)));
      setError("");
    } catch (error) {
      setError("Failed to toggle todo");
      console.log(error);
    }
  };

  const getPriorityColor = (priorityLevel) => {
    const colors = {
      low: darkMode
        ? "from-green-500 to-emerald-500"
        : "from-green-400 to-emerald-400",
      medium: darkMode
        ? "from-yellow-500 to-orange-500"
        : "from-yellow-400 to-orange-400",
      high: darkMode ? "from-red-500 to-pink-500" : "from-red-400 to-pink-400",
    };
    return colors[priorityLevel] || colors.medium;
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode ? "bg-slate-900" : "bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <Loader2
            size={32}
            className={`animate-spin ${
              darkMode ? "text-purple-400" : "text-purple-600"
            }`}
          />
          <span
            className={`text-xl font-medium ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Loading todos...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className={`text-4xl font-bold bg-gradient-to-r ${
                darkMode
                  ? "from-purple-400 to-pink-400"
                  : "from-purple-600 to-blue-600"
              } bg-clip-text text-transparent`}
            >
              Todo App
            </h1>
            <p
              className={`mt-2 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
              darkMode
                ? "bg-slate-800 text-yellow-400 hover:bg-slate-700"
                : "bg-white text-gray-700 hover:bg-gray-100 shadow-lg"
            }`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
              darkMode
                ? "bg-red-500/20 border border-red-500/30 text-red-300"
                : "bg-red-50 border border-red-200 text-red-600"
            }`}
          >
            <AlertCircle size={20} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div
            className={`p-4 rounded-2xl backdrop-blur-sm ${
              darkMode
                ? "bg-white/10 border border-white/20"
                : "bg-white/70 border border-gray-200 shadow-lg"
            }`}
          >
            <div
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {activeCount}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Active Tasks
            </div>
          </div>
          <div
            className={`p-4 rounded-2xl backdrop-blur-sm ${
              darkMode
                ? "bg-white/10 border border-white/20"
                : "bg-white/70 border border-gray-200 shadow-lg"
            }`}
          >
            <div
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {completedCount}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Completed
            </div>
          </div>
        </div>

        {/* Add Todo Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 ${
              darkMode
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
            } shadow-lg`}
          >
            <Plus size={20} />
            {showForm ? "Hide Form" : "Add New Todo"}
          </button>
        </div>

        {/* Add Todo Form */}
        {showForm && (
          <div
            className={`mb-8 p-6 rounded-3xl backdrop-blur-sm ${
              darkMode
                ? "bg-white/10 border border-white/20"
                : "bg-white/70 border border-gray-200 shadow-xl"
            }`}
          >
            <div className="space-y-6">
              {/* Title Input */}
              <div
                className={`p-6 rounded-3xl backdrop-blur-sm ${
                  darkMode
                    ? "bg-white/10 border border-white/20"
                    : "bg-white/70 border border-gray-200 shadow-xl"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-xl ${
                      darkMode ? "bg-purple-500/20" : "bg-purple-100"
                    }`}
                  >
                    <FileText
                      size={20}
                      className={
                        darkMode ? "text-purple-400" : "text-purple-600"
                      }
                    />
                  </div>
                  <h3
                    className={`text-lg font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Todo Title
                  </h3>
                </div>
                <input
                  type="text"
                  placeholder="Enter your todo title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className={`w-full px-4 py-3 rounded-2xl border-none outline-none text-lg transition-all duration-200 ${
                    darkMode
                      ? "bg-slate-800/50 text-white placeholder-gray-400 focus:bg-slate-800"
                      : "bg-white/80 text-gray-800 placeholder-gray-500 focus:bg-white shadow-inner"
                  }`}
                />
              </div>

              {/* Description Input */}
              <div
                className={`p-6 rounded-3xl backdrop-blur-sm ${
                  darkMode
                    ? "bg-white/10 border border-white/20"
                    : "bg-white/70 border border-gray-200 shadow-xl"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-xl ${
                      darkMode ? "bg-blue-500/20" : "bg-blue-100"
                    }`}
                  >
                    <FileText
                      size={20}
                      className={darkMode ? "text-blue-400" : "text-blue-600"}
                    />
                  </div>
                  <h3
                    className={`text-lg font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Description
                  </h3>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    Optional
                  </span>
                </div>
                <textarea
                  placeholder="Add more details about your todo..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className={`w-full px-4 py-3 rounded-2xl border-none outline-none text-lg transition-all duration-200 resize-none ${
                    darkMode
                      ? "bg-slate-800/50 text-white placeholder-gray-400 focus:bg-slate-800"
                      : "bg-white/80 text-gray-800 placeholder-gray-500 focus:bg-white shadow-inner"
                  }`}
                />
              </div>

              {/* Priority Selection */}
              <div
                className={`p-6 rounded-3xl backdrop-blur-sm ${
                  darkMode
                    ? "bg-white/10 border border-white/20"
                    : "bg-white/70 border border-gray-200 shadow-xl"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-2 rounded-xl bg-gradient-to-r ${getPriorityColor(
                      priority
                    )}`}
                  >
                    <Flag size={20} className="text-white" />
                  </div>
                  <h3
                    className={`text-lg font-semibold ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Priority Level
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {["low", "medium", "high"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setPriority(level)}
                      className={`p-4 rounded-2xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 capitalize ${
                        priority === level
                          ? `bg-gradient-to-r ${getPriorityColor(
                              level
                            )} text-white shadow-lg`
                          : darkMode
                          ? "bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-800"
                          : "bg-white/80 text-gray-600 hover:text-gray-800 hover:bg-white shadow-inner"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Flag size={16} />
                        {level}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={!title.trim() || isSubmitting}
                  className={`flex-1 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                    !title.trim() || isSubmitting
                      ? darkMode
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : darkMode
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:scale-105 active:scale-95"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105 active:scale-95"
                  } shadow-lg`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Adding Todo...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Add Todo
                    </>
                  )}
                </button>
              </div>

              {/* Preview */}
              {title && (
                <div
                  className={`p-6 rounded-3xl backdrop-blur-sm border-2 border-dashed transition-all duration-300 ${
                    darkMode
                      ? "bg-white/5 border-white/20"
                      : "bg-white/50 border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPriorityColor(
                        priority
                      )}`}
                    ></div>
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      Preview
                    </span>
                  </div>
                  <h4
                    className={`text-lg font-semibold mb-2 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {title}
                  </h4>
                  {description && (
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {description}
                    </p>
                  )}
                  <div
                    className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getPriorityColor(
                      priority
                    )} text-white`}
                  >
                    <Flag size={12} />
                    {priority.toUpperCase()} PRIORITY
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div
          className={`flex gap-2 mb-6 p-2 rounded-2xl backdrop-blur-sm ${
            darkMode
              ? "bg-white/10 border border-white/20"
              : "bg-white/70 border border-gray-200 shadow-lg"
          }`}
        >
          {["all", "active", "completed"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-200 capitalize ${
                filter === filterType
                  ? darkMode
                    ? "bg-purple-500 text-white shadow-lg"
                    : "bg-blue-500 text-white shadow-lg"
                  : darkMode
                  ? "text-gray-400 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div
              className={`text-center py-12 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">
                {filter === "all"
                  ? "No todos yet"
                  : filter === "active"
                  ? "No active todos"
                  : "No completed todos"}
              </p>
              <p className="text-sm mt-2">
                {filter === "all" ? 'Click "Add New Todo" to get started!' : ""}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div
                key={todo._id}
                className={`group p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                  darkMode
                    ? "bg-white/10 border border-white/20 hover:bg-white/15"
                    : "bg-white/70 border border-gray-200 shadow-lg hover:shadow-xl hover:bg-white/90"
                } ${todo.completed ? "opacity-75" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleTodo(todo._id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                      todo.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : darkMode
                        ? "border-gray-500 hover:border-purple-400"
                        : "border-gray-400 hover:border-blue-400"
                    }`}
                  >
                    {todo.completed && <Check size={14} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-lg transition-all duration-200 ${
                        todo.completed
                          ? `line-through ${
                              darkMode ? "text-gray-500" : "text-gray-400"
                            }`
                          : darkMode
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      {todo.title}
                    </p>
                    {todo.description && (
                      <p
                        className={`text-sm mt-1 ${
                          todo.completed
                            ? `line-through ${
                                darkMode ? "text-gray-600" : "text-gray-500"
                              }`
                            : darkMode
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        {todo.description}
                      </p>
                    )}
                    <div
                      className={`flex items-center gap-2 mt-1 text-xs ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${getPriorityColor(
                          todo.priority
                        )}`}
                      ></div>
                      <span className="capitalize">{todo.priority}</span>
                      <Clock size={12} />
                      <span>
                        {new Date(todo.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 ${
                      darkMode
                        ? "text-red-400 hover:bg-red-500/20"
                        : "text-red-500 hover:bg-red-50"
                    }`}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Progress Bar */}
        {todos.length > 0 && (
          <div
            className={`mt-8 p-4 rounded-2xl backdrop-blur-sm ${
              darkMode
                ? "bg-white/10 border border-white/20"
                : "bg-white/70 border border-gray-200 shadow-lg"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Progress
              </span>
              <span
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {Math.round((completedCount / todos.length) * 100)}%
              </span>
            </div>
            <div
              className={`w-full h-2 rounded-full overflow-hidden ${
                darkMode ? "bg-slate-700" : "bg-gray-200"
              }`}
            >
              <div
                className={`h-full transition-all duration-500 ease-out ${
                  darkMode
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-gradient-to-r from-blue-500 to-purple-500"
                }`}
                style={{ width: `${(completedCount / todos.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
