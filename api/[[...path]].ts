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

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const nodeReq = req as unknown as import('http').IncomingMessage & { url?: string };
  const nodeRes = res as unknown as import('http').ServerResponse;
  if (nodeReq.url && !nodeReq.url.startsWith('/api')) {
    nodeReq.url = '/api' + (nodeReq.url.startsWith('/') ? nodeReq.url : '/' + nodeReq.url);
  }
  return new Promise((resolve, reject) => {
    nodeRes.once('finish', resolve);
    nodeRes.once('error', reject);
    ensureDb()
      .then(() => {
        app(nodeReq, nodeRes);
      })
      .catch(reject);
  });
}
