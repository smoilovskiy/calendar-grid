import type { VercelRequest, VercelResponse } from '@vercel/node';
// @ts-expect-error built server ESM
import app from '../server/dist/app.js';
// @ts-expect-error built server ESM
import { initDb } from '../server/dist/db.js';

let dbReady: Promise<void> | null = null;

function ensureDb(): Promise<void> {
  if (!dbReady) dbReady = initDb();
  return dbReady;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  await ensureDb();
  app(req as unknown as import('http').IncomingMessage, res as unknown as import('http').ServerResponse);
}
