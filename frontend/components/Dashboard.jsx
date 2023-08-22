import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const loggedInUser = Cookies.get("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch todos only if the user is authenticated
    if (loggedInUser) {
      fetchTodos();
    }
  }, [loggedInUser]);

  const handleCreateTodo = async () => {
    try {
      await axios.post(
        "http://localhost:3000/dashboard/create-todo",
        { title: todoTitle, description: todoDescription },
        {
          headers: { Authorization: `Bearer ${loggedInUser}` },
        }
      );
      console.log("Todo created successfully!");
      setTodoTitle("");
      setTodoDescription("");
      fetchTodos();
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleSignOut = () => {
    // Clear authToken from cookies
    Cookies.remove("authToken");
    // Redirect to the sign-up page
    navigate("/"); // Use useNavigate to handle redirection
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/dashboard/todos",
        {
          headers: { Authorization: `Bearer ${loggedInUser}` },
        }
      );
      setTodos(response.data); // Make sure to use response.data instead of response.data.todos
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleSignOut}
        className="ml-[1960px] mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        Sign Out
      </button>
      <h2 className="mb-4 text-2xl font-semibold">Create Todo</h2>
      <input
        type="text"
        placeholder="Title"
        value={todoTitle}
        onChange={(e) => setTodoTitle(e.target.value)}
        className="w-full px-4 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <input
        type="text"
        placeholder="Description"
        value={todoDescription}
        onChange={(e) => setTodoDescription(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        onClick={handleCreateTodo}
        className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Create Todo
      </button>

      <h2 className="mt-8 mb-4 text-2xl font-semibold">Todos</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-white bg-blue-500">
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Description</th>
          </tr>
        </thead>
        <tbody>
          {todos &&
            todos.map((todo) => (
              <tr key={todo.id} className="border-t">
                <td className="px-4 py-2 border-b border-r">{todo.title}</td>
                <td className="px-4 py-2 border-b">{todo.description}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
