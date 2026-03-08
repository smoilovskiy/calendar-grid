import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHandler } from './_shared';

export default function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  return createHandler(req, res);
}
