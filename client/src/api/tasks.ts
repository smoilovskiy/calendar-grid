const API_BASE = '/api/tasks';

export type Task = {
  id: string;
  title: string;
  date: string;
  order: number;
};

export async function fetchTasks(dateFrom: string, dateTo: string): Promise<Task[]> {
  const res = await fetch(
    `${API_BASE}?dateFrom=${encodeURIComponent(dateFrom)}&dateTo=${encodeURIComponent(dateTo)}`
  );
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTask(
  title: string,
  date: string,
  order: number = 0
): Promise<Task> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, date, order }),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTask(
  id: string,
  data: { title?: string; date?: string; order?: number }
): Promise<Task> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
}
