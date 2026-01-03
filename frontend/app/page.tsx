"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/contexts/ToastContext";

type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // CREATE
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // EDIT
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

  // CREATE (sem reload)
  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const res = await fetch("http://localhost:8080/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (!res.ok) {
      const data = await res.json();
      if (data?.errors) {
        setErrors(data.errors);
        return;
      }
      showToast("Erro ao criar task", "error");
      return;
    }

    const newTask = await res.json();

    setTasks((prev) => [...prev, newTask]);
    setTitle("");
    setDescription("");
    showToast("Task criada com sucesso");
  }

  // DELETE (otimista)
  async function handleDeleteTask(id: number) {
    const previous = tasks;
    setTasks((prev) => prev.filter((task) => task.id !== id));

    const res = await fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      setTasks(previous);
      showToast("Erro ao deletar task", "error");
      return;
    }

    showToast("Task deletada");
  }

  // UPDATE (otimista)
  async function handleUpdateTask(id: number) {
    const previous = tasks;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, title: editTitle, description: editDescription }
          : task
      )
    );

    const res = await fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
      }),
    });

    if (!res.ok) {
      setTasks(previous);
      showToast("Erro ao atualizar task", "error");
      return;
    }

    setEditingId(null);
    showToast("Task atualizada");
  }

  // TOGGLE COMPLETED (otimista)
  async function handleToggleCompleted(id: number) {
    const previous = tasks;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    const res = await fetch(`http://localhost:8080/api/tasks/${id}/toggle`, {
      method: "PATCH",
    });

    if (!res.ok) {
      setTasks(previous);
      showToast("Erro ao atualizar status", "error");
      return;
    }

    showToast("Status atualizado");
  }

  useEffect(() => {
    loadTasks();
  }, []);

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Minhas Tasks</h1>

      {/* CREATE */}
      <form onSubmit={handleCreateTask} className="mb-6 space-y-3">
        <div>
          <input
            placeholder="Título"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
            className={`w-full border p-2 rounded ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        <div>
          <input
            placeholder="Descrição"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: "" }));
            }}
            className={`w-full border p-2 rounded ${
              errors.description ? "border-red-500" : ""
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

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
                  <strong
                    className={`cursor-pointer ${
                      task.completed ? "line-through text-green-600" : ""
                    }`}
                    onClick={() => handleToggleCompleted(task.id)}
                  >
                    {task.title}
                  </strong>

                  <span className="text-sm text-gray-600">
                    {task.description}
                  </span>

                  <span
                    className={`text-sm cursor-pointer ${
                      task.completed ? "text-green-600" : ""
                    }`}
                    onClick={() => handleToggleCompleted(task.id)}
                  >
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
