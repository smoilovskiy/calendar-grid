import { Router, Request, Response } from 'express';

const NAGER_API = 'https://date.nager.at/api/v3';

let cached: { data: unknown; ts: number } | null = null;
const CACHE_MS = 24 * 60 * 60 * 1000;

export const countriesRouter = Router();

countriesRouter.get('/', async (_req: Request, res: Response) => {
  if (cached && Date.now() - cached.ts < CACHE_MS) {
    res.json(cached.data);
    return;
  }
  try {
    const response = await fetch(`${NAGER_API}/AvailableCountries`);
    if (!response.ok) {
      res.status(response.status).json({ error: 'Countries API error' });
      return;
    }
    const data = await response.json();
    cached = { data, ts: Date.now() };
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});
