import { Router, Request, Response } from 'express';
import { pool } from '../db.js';

export const activityRouter = Router();

activityRouter.get('/', async (req: Request, res: Response) => {
  if (!pool) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const taskId = typeof req.query.taskId === 'string' ? req.query.taskId : null;
  try {
    const query = taskId
      ? `SELECT id, user_name, action, task_id, task_title, details, created_at
         FROM activity_log WHERE task_id = $1 ORDER BY created_at DESC LIMIT $2`
      : `SELECT id, user_name, action, task_id, task_title, details, created_at
         FROM activity_log ORDER BY created_at DESC LIMIT $1`;
    const params = taskId ? [taskId, limit] : [limit];
    const { rows } = await pool.query(query, params);
    res.json(rows.map((r: { created_at?: Date }) => ({ ...r, created_at: r.created_at?.toISOString() ?? null })));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});
