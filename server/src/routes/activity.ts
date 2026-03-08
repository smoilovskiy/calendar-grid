import { Router, Request, Response } from 'express';
import { pool } from '../db.js';

export const activityRouter = Router();

activityRouter.get('/', async (_req: Request, res: Response) => {
  if (!pool) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }
  const limit = Math.min(Number(_req.query.limit) || 50, 200);
  try {
    const { rows } = await pool.query(
      `SELECT id, user_name, action, task_id, task_title, details, created_at
       FROM activity_log
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );
    res.json(rows.map((r) => ({ ...r, created_at: r.created_at?.toISOString() ?? null })));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});
