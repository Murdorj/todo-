import { useEffect, useState } from "react";

const fetchWithFallback = async (path, options = {}) => {
  const servers = ["http://localhost:8081", "http://localhost:5050"];
  let lastError;

  for (let base of servers) {
    try {
      const res = await fetch(`${base}${path}`, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (options.method === "DELETE") return {}; 
      return await res.json();
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
};

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  const fetchTodos = async () => {
    try {
      const data = await fetchWithFallback("/api/todos");
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const newTodo = { title, completed: false, dueDate };

    try {
      const created = await fetchWithFallback("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });

      setTodos([...todos, created]);
      setTitle("");
      setDueDate("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const handleComplete = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo || todo.completed) return;

    const updated = { ...todo, completed: true };

    try {
      const updatedTodo = await fetchWithFallback(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (error) {
      console.error("Failed to complete todo:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetchWithFallback(`/api/todos/${id}`, { method: "DELETE" });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">
        ToDo App
      </h1>

      <form
        onSubmit={handleAdd}
        className="space-y-4 mb-10 bg-white p-6 shadow rounded"
      >
        <input
          type="text"
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-blue-500"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Task
        </button>
      </form>

      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="bg-white p-5 rounded shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{todo.title}</h2>
              <span
                className={`text-sm px-2 py-1 rounded-full ${
                  todo.completed
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {todo.completed ? "Done" : "In Progress"}
              </span>
            </div>

            <p className="text-sm text-gray-700">
              <strong>Due:</strong>{" "}
              {todo.dueDate?.replace("T", " ").slice(0, 16) || "—"}
            </p>
            <p className="text-sm text-gray-400">
              <strong>Created:</strong>{" "}
              {todo.createdAt?.replace("T", " ").slice(0, 16)}
            </p>

            <div className="mt-4 flex gap-4">
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-red-600 font-medium hover:underline"
              >
                Delete
              </button>

              {!todo.completed && (
                <button
                  onClick={() => handleComplete(todo.id)}
                  className="text-green-600 font-medium hover:underline"
                >
                  Mark as Complete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
