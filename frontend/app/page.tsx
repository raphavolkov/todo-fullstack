"use client";

import { useEffect, useState } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function loadTasks() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/tasks");
      const data = await res.json();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return;

    await fetch("http://localhost:8080/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    setTitle("");
    setDescription("");
    loadTasks();
  }

  // 🔥 DELETE
  async function handleDeleteTask(id: number) {
    await fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "DELETE",
    });

    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  if (loading) {
    return <p className="p-6">Carregando...</p>;
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Minhas Tasks</h1>

      {/* FORM */}
      <form onSubmit={handleCreateTask} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Título da task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2"
        />

        <input
          type="text"
          placeholder="Descrição (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded p-2"
        />

        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Criar task
        </button>
      </form>

      {/* LISTA */}
      {tasks.length === 0 && (
        <p className="text-gray-500">Nenhuma task encontrada.</p>
      )}

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border rounded p-3 flex items-center justify-between"
          >
            <div className="flex flex-col gap-1">
              <strong>{task.title}</strong>
              <span className="text-sm text-gray-600">{task.description}</span>
              <span className="text-sm">
                Status: {task.completed ? "Concluída" : "Pendente"}
              </span>
            </div>

            <button
              onClick={() => handleDeleteTask(task.id)}
              className="text-red-600 hover:text-red-800"
            >
              Deletar
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
