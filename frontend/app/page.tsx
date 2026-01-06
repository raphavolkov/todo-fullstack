"use client";

import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { useTasks } from "@/hooks/useTasks";

export default function Home() {
  const { tasks, loading, createTask, deleteTask, updateTask, toggleTask } =
    useTasks();

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Minhas Tasks</h1>

      <TaskForm onTaskCreated={createTask} />

      <TaskList
        tasks={tasks}
        onDelete={deleteTask}
        onUpdate={updateTask}
        onToggle={toggleTask}
      />
    </main>
  );
}
