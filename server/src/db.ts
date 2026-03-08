import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

export const pool = connectionString
  ? new Pool({ connectionString })
  : null;

export async function initDb(): Promise<void> {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      date DATE NOT NULL,
      "order" INT NOT NULL DEFAULT 0
    );
  `);
  await pool.query(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT;`);
  await pool.query(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS labels JSONB DEFAULT '[]'::jsonb;`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_name TEXT NOT NULL,
      action TEXT NOT NULL,
      task_id UUID,
      task_title TEXT,
      details JSONB,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);
}
