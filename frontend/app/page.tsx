"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { api, Task } from "@/lib/api";

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

  // ======================
  // LOAD
  // ======================
  async function loadTasks() {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch {
      showToast("Erro ao carregar tasks", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // ======================
  // CREATE
  // ======================
  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    try {
      const newTask = await api.createTask({ title, description });
      setTasks((prev) => [...prev, newTask]);
      setTitle("");
      setDescription("");
      showToast("Task criada com sucesso");
    } catch (err: any) {
      if (err?.errors) {
        setErrors(err.errors);
        return;
      }
      showToast("Erro ao criar task", "error");
    }
  }

  // ======================
  // DELETE
  // ======================
  async function handleDeleteTask(id: number) {
    const previous = tasks;
    setTasks((prev) => prev.filter((task) => task.id !== id));

    try {
      await api.deleteTask(id);
      showToast("Task deletada");
    } catch {
      setTasks(previous);
      showToast("Erro ao deletar task", "error");
    }
  }

  // ======================
  // UPDATE
  // ======================
  async function handleUpdateTask(id: number) {
    const previous = tasks;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, title: editTitle, description: editDescription }
          : task
      )
    );

    try {
      await api.updateTask(id, {
        title: editTitle,
        description: editDescription,
      });
      setEditingId(null);
      showToast("Task atualizada");
    } catch {
      setTasks(previous);
      showToast("Erro ao atualizar task", "error");
    }
  }

  // ======================
  // TOGGLE
  // ======================
  async function handleToggleCompleted(id: number) {
    const previous = tasks;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    try {
      await api.toggleTask(id);
      showToast("Status atualizado");
    } catch {
      setTasks(previous);
      showToast("Erro ao atualizar status", "error");
    }
  }

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
                    type="button"
                    onClick={() => handleUpdateTask(task.id)}
                    className="text-green-600"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
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
                    type="button"
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
                    type="button"
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
