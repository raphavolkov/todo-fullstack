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

  useEffect(() => {
    fetch("http://localhost:8080/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-6">Carregando...</p>;
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Minhas Tasks</h1>

      {tasks.length === 0 && (
        <p className="text-gray-500">Nenhuma task encontrada.</p>
      )}

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border rounded p-3 flex flex-col gap-1">
            <strong>{task.title}</strong>
            <span className="text-sm text-gray-600">{task.description}</span>
            <span className="text-sm">
              Status: {task.completed ? "Concluída" : "Pendente"}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
