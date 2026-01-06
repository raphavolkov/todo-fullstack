"use client";

import { useState } from "react";
import { Task } from "@/lib/api";

type Props = {
  task: Task;
  onDelete: () => void;
  onToggle: () => void;
  onUpdate: (title: string, description: string) => void;
};

export default function TaskItem({
  task,
  onDelete,
  onToggle,
  onUpdate,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  function handleSave() {
    onUpdate(title, description);
    setIsEditing(false);
  }

  return (
    <li className="border rounded p-3 flex justify-between items-start">
      {isEditing ? (
        <div className="flex flex-col gap-2 w-full">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-1 rounded"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-1 rounded"
          />

          <div className="flex gap-2">
            <button onClick={handleSave} className="text-green-600">
              Salvar
            </button>
            <button
              onClick={() => setIsEditing(false)}
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
              onClick={onToggle}
              className={`cursor-pointer ${
                task.completed ? "line-through text-green-600" : ""
              }`}
            >
              {task.title}
            </strong>

            <span className="text-sm text-gray-600">{task.description}</span>

            <span
              onClick={onToggle}
              className={`text-sm cursor-pointer ${
                task.completed ? "text-green-600" : ""
              }`}
            >
              Status: {task.completed ? "Concluída" : "Pendente"}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600"
            >
              Editar
            </button>
            <button onClick={onDelete} className="text-red-600">
              Deletar
            </button>
          </div>
        </>
      )}
    </li>
  );
}
