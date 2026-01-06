"use client";

import { Task } from "@/lib/api";
import TaskItem from "./TaskItem";

type Props = {
  tasks: Task[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onUpdate: (id: number, title: string, description: string) => void;
};

export default function TaskList({
  tasks,
  onDelete,
  onToggle,
  onUpdate,
}: Props) {
  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={() => onDelete(task.id)}
          onToggle={() => onToggle(task.id)}
          onUpdate={(title, description) =>
            onUpdate(task.id, title, description)
          }
        />
      ))}
    </ul>
  );
}
