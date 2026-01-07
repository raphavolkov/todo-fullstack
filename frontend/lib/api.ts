const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let error;
    try {
      error = await res.json();
    } catch {
      error = { message: "Erro inesperado" };
    }
    throw error;
  }

  // DELETE não retorna body
  if (res.status === 204) {
    return null as T;
  }

  return res.json();
}

export const api = {
  getTasks: () => request<Task[]>("/tasks"),

  createTask: (data: { title: string; description: string }) =>
    request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteTask: (id: number) =>
    request<void>(`/tasks/${id}`, { method: "DELETE" }),

  updateTask: (id: number, data: { title: string; description: string }) =>
    request<Task>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  toggleTask: (id: number) =>
    request<Task>(`/tasks/${id}/toggle`, {
      method: "PATCH",
    }),
};
