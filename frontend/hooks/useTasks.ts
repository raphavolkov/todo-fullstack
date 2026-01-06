"use client";

import { useEffect, useState } from "react";
import { api, Task } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

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

  function createTask(task: Task) {
    setTasks((prev) => [...prev, task]);
  }

  async function deleteTask(id: number) {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await api.deleteTask(id);
      showToast("Task deletada");
    } catch {
      setTasks(previous);
      showToast("Erro ao deletar task", "error");
    }
  }

  async function updateTask(id: number, title: string, description: string) {
    const previous = tasks;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title, description } : t))
    );

    try {
      await api.updateTask(id, { title, description });
      showToast("Task atualizada");
    } catch {
      setTasks(previous);
      showToast("Erro ao atualizar task", "error");
    }
  }

  async function toggleTask(id: number) {
    const previous = tasks;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

    try {
      await api.toggleTask(id);
      showToast("Status atualizado");
    } catch {
      setTasks(previous);
      showToast("Erro ao atualizar status", "error");
    }
  }

  return {
    tasks,
    loading,
    createTask,
    deleteTask,
    updateTask,
    toggleTask,
  };
}
