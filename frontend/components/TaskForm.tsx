"use client";

import { useState } from "react";
import { api, Task } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";

type Props = {
  onTaskCreated: (task: Task) => void;
};

export default function TaskForm({ onTaskCreated }: Props) {
  const { showToast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    try {
      const newTask = await api.createTask({ title, description });
      onTaskCreated(newTask);

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

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3">
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
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
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
  );
}
