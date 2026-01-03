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

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    setTitle("");
    setDescription("");
    loadTasks();
  }

  async function handleDeleteTask(id: number) {
    await fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "DELETE",
    });
    loadTasks();
  }

  async function handleUpdateTask(id: number) {
    await fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
      }),
    });

    setEditingId(null);
    loadTasks();
  }

  useEffect(() => {
    loadTasks();
  }, []);

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Minhas Tasks</h1>

      {/* CREATE */}
      <form onSubmit={handleCreateTask} className="mb-6 space-y-2">
        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button className="bg-black text-white px-4 py-2 rounded">
          Criar task
        </button>
      </form>

      {/* LIST */}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border rounded p-3 flex justify-between items-start"
          >
            {editingId === task.id ? (
              <div className="flex flex-col gap-2 w-full">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border p-1 rounded"
                />
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="border p-1 rounded"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateTask(task.id)}
                    className="text-green-600"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <strong>{task.title}</strong>
                  <span className="text-sm text-gray-600">
                    {task.description}
                  </span>
                  <span className="text-sm">
                    Status: {task.completed ? "Concluída" : "Pendente"}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setEditingId(task.id);
                      setEditTitle(task.title);
                      setEditDescription(task.description);
                    }}
                    className="text-blue-600"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600"
                  >
                    Deletar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
