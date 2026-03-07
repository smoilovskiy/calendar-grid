import { Router, Request, Response } from 'express';

const NAGER_API = 'https://date.nager.at/api/v3';

const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_MS = 60 * 60 * 1000;

export const holidaysRouter = Router();

holidaysRouter.get('/', async (req: Request, res: Response) => {
  const year = req.query.year as string;
  const countryCode = (req.query.countryCode as string) || 'US';

  if (!year || !/^\d{4}$/.test(year)) {
    res.status(400).json({ error: 'Valid year (YYYY) required' });
    return;
  }

  const key = `${year}-${countryCode.toUpperCase()}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_MS) {
    res.json(cached.data);
    return;
  }

  try {
    const url = `${NAGER_API}/PublicHolidays/${year}/${countryCode.toUpperCase()}`;
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).json({ error: 'Holidays API error' });
      return;
    }
    const data = await response.json();
    cache.set(key, { data, ts: Date.now() });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch holidays' });
  }
});
