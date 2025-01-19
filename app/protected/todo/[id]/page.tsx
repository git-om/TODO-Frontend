"use client";

import { useQuery, useMutation, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, FormEvent } from "react";

const GET_TODO = gql`
  query ($id: Int!) {
    getTodoById(id: $id) {
      id
      task
      isDone
    }
  }
`;

const UPDATE_TODO = gql`
  mutation ($id: Int!, $task: String!) {
    updateTodoTask(id: $id, task: $task) {
      id
      task
      isDone
    }
  }
`;

type TodoDetailProps = {
  params: Promise<{ id: string }>;
};

export default function TodoDetail({ params }: TodoDetailProps) {
  const router = useRouter();

  // State for ID and task input
  const [todoId, setTodoId] = useState<number | null>(null);
  const [task, setTask] = useState("");

  // Fetch and validate `id` when params resolve
  useEffect(() => {
    params
      .then((resolvedParams) => {
        const id = parseInt(resolvedParams.id, 10);
        if (!isNaN(id)) {
          setTodoId(id);
        } else {
          router.push("/protected/todo");
        }
      })
      .catch(() => {
        router.push("/protected/todo");
      });
  }, [params, router]);

  // Apollo useQuery hook
  const { data, loading } = useQuery(GET_TODO, {
    variables: { id: todoId },
    skip: todoId === null,
    onError: () => {
      router.push("/protected/todo");
      return(<>
      <h1>Unauthorized Access</h1>
      </>);
    },
  });


  // Apollo useMutation hook
  const [updateTodo] = useMutation(UPDATE_TODO, {
    onError: () => {
      router.push("/protected/todo");
    },
  });

  // Sync task input with fetched data
  useEffect(() => {
    if (data?.getTodoById) {
      setTask(data.getTodoById.task);
    }
  }, [data]);

  // Handle loading state
  if (loading || todoId === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  // Handle form submission
  const handleUpdateTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!task.trim()) {
      alert("Task cannot be empty!");
      return;
    }

    try {
      await updateTodo({
        variables: { id: todoId, task },
      });
      router.push("/protected/todo");
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-gray-700">Edit Task</h1>
        <form onSubmit={handleUpdateTodo} className="space-y-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Update your task..."
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Update Task
          </button>
        </form>
        <button
          onClick={() => router.push("/protected/todo")}
          className="w-full mt-4 bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
