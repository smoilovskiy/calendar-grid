import { Router, Request, Response } from 'express';
import { pool } from '../db.js';

export const tasksRouter = Router();

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
      'SELECT id, title, date, "order" FROM tasks WHERE date >= $1 AND date <= $2 ORDER BY date, "order"',
      [dateFrom, dateTo]
    );
    res.json(rows.map((r) => ({ ...r, date: dateStr(r.date) })));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

tasksRouter.post('/', async (req: Request, res: Response) => {
  if (!pool) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }
  const { title, date, order } = req.body as { title?: string; date?: string; order?: number };
  if (!title || !date) {
    res.status(400).json({ error: 'title and date required' });
    return;
  }
  const orderVal = typeof order === 'number' ? order : 0;
  try {
    const { rows } = await pool.query(
      'INSERT INTO tasks (title, date, "order") VALUES ($1, $2, $3) RETURNING id, title, date, "order"',
      [title.trim(), date, orderVal]
    );
    const r = rows[0];
    res.status(201).json({ ...r, date: dateStr(r.date) });
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
  const { title, date, order } = req.body as { title?: string; date?: string; order?: number };
  const updates: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  if (title !== undefined) {
    updates.push(`title = $${i++}`);
    values.push(title.trim());
  }
  if (date !== undefined) {
    updates.push(`date = $${i++}`);
    values.push(date);
  }
  if (order !== undefined) {
    updates.push(`"order" = $${i++}`);
    values.push(order);
  }
  if (updates.length === 0) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }
  values.push(id);
  try {
    const { rows } = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${i} RETURNING id, title, date, "order"`,
      values
    );
    if (rows.length === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    const r = rows[0];
    res.json({ ...r, date: dateStr(r.date) });
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
  try {
    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    if (rowCount === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});
