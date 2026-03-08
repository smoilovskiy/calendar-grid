import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHandler } from '../_shared';

/**
 * Explicit handler for /api/tasks/:id so Vercel routes PUT/DELETE /api/tasks/:id here
 * instead of returning 404 when catch-all does not match multi-segment paths.
 */
export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return createHandler(req, res);
}
