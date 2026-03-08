import { Router, Request, Response } from 'express';
import { pool } from '../db.js';

export const tasksRouter = Router();

function getUserName(req: Request): string {
  const name = req.headers['x-user-name'];
  if (typeof name === 'string' && name.trim()) return name.trim().slice(0, 100);
  return 'Anonymous';
}

async function logActivity(
  userName: string,
  action: string,
  taskId: string | null,
  taskTitle: string | null,
  details: Record<string, unknown> | null
): Promise<void> {
  if (!pool) return;
  await pool.query(
    `INSERT INTO activity_log (user_name, action, task_id, task_title, details) VALUES ($1, $2, $3, $4, $5)`,
    [userName, action, taskId, taskTitle, details ? JSON.stringify(details) : null]
  );
}

function dateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

tasksRouter.get('/', async (req: Request, res: Response) => {
  if (!pool) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }
  const dateFrom = req.query.dateFrom as string;
  const dateTo = req.query.dateTo as string;
  if (!dateFrom || !dateTo) {
    res.status(400).json({ error: 'dateFrom and dateTo (YYYY-MM-DD) required' });
    return;
  }
  try {
    const { rows } = await pool.query(
      'SELECT id, title, description, date, "order", COALESCE(labels, \'[]\'::jsonb) AS labels FROM tasks WHERE date >= $1 AND date <= $2 ORDER BY date, "order"',
      [dateFrom, dateTo]
    );
    res.json(rows.map((r: { date: Date; labels?: unknown }) => ({ ...r, date: dateStr(r.date), labels: Array.isArray(r.labels) ? r.labels : [] })));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

tasksRouter.post('/', async (req: Request, res: Response) => {
  if (!pool) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }
  const { title, date, order, description, labels } = req.body as { title?: string; date?: string; order?: number; description?: string; labels?: string[] };
  if (!title || !date) {
    res.status(400).json({ error: 'title and date required' });
    return;
  }
  const orderVal = typeof order === 'number' ? order : 0;
  const descVal = description != null ? String(description).trim() : null;
  const labelsVal = Array.isArray(labels) ? labels.filter((x): x is string => typeof x === 'string').slice(0, 10) : [];
  const userName = getUserName(req);
  try {
    const { rows } = await pool.query(
      'INSERT INTO tasks (title, description, date, "order", labels) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description, date, "order", COALESCE(labels, \'[]\'::jsonb) AS labels',
      [title.trim(), descVal || null, date, orderVal, JSON.stringify(labelsVal)]
    );
    const r = rows[0];
    await logActivity(userName, 'created', r.id, r.title, { date });
    res.status(201).json({ ...r, date: dateStr(r.date), labels: Array.isArray(r.labels) ? r.labels : [] });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

tasksRouter.put('/:id', async (req: Request, res: Response) => {
  if (!pool) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }
  const id = req.params.id;
  const { title, date, order, description, labels } = req.body as { title?: string; date?: string; order?: number; description?: string; labels?: string[] };
  const updates: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  if (title !== undefined) {
    updates.push(`title = $${i++}`);
    values.push(title.trim());
  }
  if (description !== undefined) {
    updates.push(`description = $${i++}`);
    values.push(description === '' ? null : String(description).trim());
  }
  if (date !== undefined) {
    updates.push(`date = $${i++}`);
    values.push(date);
  }
  if (order !== undefined) {
    updates.push(`"order" = $${i++}`);
    values.push(order);
  }
  if (labels !== undefined) {
    const labelsVal = Array.isArray(labels) ? labels.filter((x): x is string => typeof x === 'string').slice(0, 10) : [];
    updates.push(`labels = $${i++}`);
    values.push(JSON.stringify(labelsVal));
  }
  if (updates.length === 0) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }
  values.push(id);
  const userName = getUserName(req);
  try {
    const { rows } = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${i} RETURNING id, title, description, date, "order", COALESCE(labels, '[]'::jsonb) AS labels`,
      values
    );
    if (rows.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    const r = rows[0];
    const action = date !== undefined ? 'moved' : 'updated';
    const details: Record<string, unknown> = {};
    if (title !== undefined) details.title = true;
    if (description !== undefined) details.description = true;
    if (date !== undefined) details.date = date;
    if (order !== undefined) details.order = order;
    if (labels !== undefined) details.labels = true;
    await logActivity(userName, action, r.id, r.title, Object.keys(details).length ? details : null);
    res.json({ ...r, date: dateStr(r.date), labels: Array.isArray(r.labels) ? r.labels : [] });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

tasksRouter.delete('/:id', async (req: Request, res: Response) => {
  if (!pool) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }
  const id = req.params.id;
  const userName = getUserName(req);
  try {
    const { rows } = await pool.query('SELECT id, title FROM tasks WHERE id = $1', [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    await logActivity(userName, 'deleted', id, rows[0].title, null);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});
