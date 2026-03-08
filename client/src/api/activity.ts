export type ActivityEntry = {
  id: string;
  user_name: string;
  action: string;
  task_id: string | null;
  task_title: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

export async function fetchActivity(limit: number = 50): Promise<ActivityEntry[]> {
  const res = await fetch(`/api/activity?limit=${Math.min(limit, 200)}`);
  if (!res.ok) throw new Error('Failed to fetch activity');
  return res.json();
}

export async function fetchActivityForTask(taskId: string, limit: number = 20): Promise<ActivityEntry[]> {
  const res = await fetch(`/api/activity?taskId=${encodeURIComponent(taskId)}&limit=${Math.min(limit, 100)}`);
  if (!res.ok) throw new Error('Failed to fetch activity');
  return res.json();
}
