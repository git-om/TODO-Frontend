"use client";

import { useQuery, useMutation, gql, useApolloClient } from "@apollo/client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GET_USER = gql`
  query {
    getUser {
      id
      name
      todos {
        id
        task
        isDone
      }
    }
  }
`;

const ADD_TODO = gql`
  mutation ($task: String!) {
    createTodo(task: $task)
  }
`;

const DELETE_TODO = gql`
  mutation ($deleteTodoId: Int!) {
    deleteTodo(id: $deleteTodoId)
  }
`;

const MARK_TODO = gql`
  mutation ($todoId: Int!) {
    markTodo(todoId: $todoId) {
      id
      task
      isDone
    }
  }
`;

type TodoType = {
  id: number;
  task: string;
  isDone: boolean;
};

export default function Todo() {
  const router = useRouter();
  const [loadingToken, setLoadingToken] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token in useEffect:", token);
    if (!token) {
      console.log("No token found. Redirecting to login.");
      router.push("/");
    } else {
      setLoadingToken(false);
    }
  }, [router]);

  const { data, loading: queryLoading, error, refetch } = useQuery(GET_USER, {
    skip: loadingToken, // Skip the query until token validation is complete
  });

  const [markTodo] = useMutation(MARK_TODO);
  const [addTodo] = useMutation(ADD_TODO);
  const [deleteTodo] = useMutation(DELETE_TODO);

  if (loadingToken || queryLoading) {
    console.log("Loading state active: loadingToken:", loadingToken, " queryLoading:", queryLoading);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-center text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching user data:", error);
    return (
      <p className="text-center text-red-500 text-lg">
        An error occurred while fetching data. Please try again later.
      </p>
    );
  }

  const handleToggleTodo = async (todoId: number) => {
    console.log("Toggling todo with ID:", todoId);
    try {
      await markTodo({
        variables: { todoId },
      });
      console.log("Todo toggled successfully:", todoId);
      refetch();
    } catch (err) {
      console.error("Error toggling todo status:", err);
    }
  };

  const handleAddTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const task = formData.get("task") as string;

    console.log("Adding new todo with task:", task);

    if (!task.trim()) {
      console.log("Task cannot be empty!");
      alert("Task cannot be empty!");
      return;
    }

    try {
      await addTodo({
        variables: { task },
      });
      console.log("Todo added successfully:", task);
      refetch();
      form.reset();
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    console.log("Deleting todo with ID:", todoId);
    try {
      await deleteTodo({
        variables: { deleteTodoId: todoId },
      });
      console.log("Todo deleted successfully:", todoId);
      refetch();
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const handleLogout = () => {
    console.log("Logging out user.");
    localStorage.removeItem("token");
    const client = useApolloClient(); // Access Apollo client
    client.clearStore(); // Clear Apollo cache
    router.push("/");
  };

  console.log("User data:", data);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-xl">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-purple-700">
          Hello, {data.getUser.name}!
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Organize your tasks effortlessly. Mark tasks as complete by clicking
          the checkbox or the task name.
        </p>
        <form
          onSubmit={handleAddTodo}
          className="flex items-center mb-6 space-x-4"
        >
          <input
            name="task"
            type="text"
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            Add
          </button>
        </form>
        <div className="space-y-4">
          {data.getUser.todos.length > 0 ? (
            data.getUser.todos.map((todo: TodoType) => (
              <div
                key={todo.id}
                className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={todo.isDone}
                    onChange={() => handleToggleTodo(todo.id)}
                    className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                  />
                  <h2
                    className={`text-lg font-medium cursor-pointer transition ${
                      todo.isDone
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                    onClick={() => handleToggleTodo(todo.id)}
                  >
                    {todo.task}
                  </h2>
                </div>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="flex items-center justify-center w-10 h-10 p-0 bg-red-500 hover:bg-red-600 rounded-full shadow focus:outline-none"
                >
                  <svg
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 32 32"
                  >
                    <path d="M 16 3 C 8.832031 3 3 8.832031 3 16 C 3 23.167969 8.832031 29 16 29 C 23.167969 29 29 23.167969 29 16 C 29 8.832031 23.167969 3 16 3 Z M 16 5 C 22.085938 5 27 9.914063 27 16 C 27 22.085938 22.085938 27 16 27 C 9.914063 27 5 22.085938 5 16 C 5 9.914063 9.914063 5 16 5 Z M 12.21875 10.78125 L 10.78125 12.21875 L 14.5625 16 L 10.78125 19.78125 L 12.21875 21.21875 L 16 17.4375 L 19.78125 21.21875 L 21.21875 19.78125 L 17.4375 16 L 21.21875 12.21875 L 19.78125 10.78125 L 16 14.5625 Z"></path>
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg">
              No tasks available. Create a todo using the field above.
            </p>
          )}
        </div>
        <Link
          href="/auth/signin"
          onClick={handleLogout}
          className="mt-8 w-full inline-block text-center bg-red-600 text-white py-2 px-4 rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          Logout
        </Link>
        <footer className="text-center text-gray-500 text-sm mt-8">
          Built with ❤️ using Apollo Client and React
        </footer>
      </div>
    </div>
  );
}
