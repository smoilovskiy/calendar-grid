import { getStoredUserName } from '../utils/userName';

const API_BASE = '/api/tasks';

function apiHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-User-Name': getStoredUserName(),
    ...extra,
  };
}

export type Task = {
  id: string;
  title: string;
  description?: string | null;
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
  order: number = 0,
  description?: string
): Promise<Task> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: apiHeaders(),
    body: JSON.stringify({ title, date, order, description: description ?? null }),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTask(
  id: string,
  data: { title?: string; date?: string; order?: number; description?: string }
): Promise<Task> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: apiHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: { 'X-User-Name': getStoredUserName() },
  });
  if (!res.ok) throw new Error('Failed to delete task');
}
