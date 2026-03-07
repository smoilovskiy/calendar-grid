const API_BASE = '/api';

export type HolidayItem = {
  date: string;
  name: string;
  localName: string;
  countryCode: string;
};

export async function fetchHolidays(year: number, countryCode: string): Promise<HolidayItem[]> {
  const res = await fetch(
    `${API_BASE}/holidays?year=${year}&countryCode=${encodeURIComponent(countryCode)}`
  );
  if (!res.ok) throw new Error('Failed to fetch holidays');
  return res.json();
}

export function holidaysByDate(holidays: HolidayItem[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const h of holidays) {
    if (!map[h.date]) map[h.date] = h.localName;
    else map[h.date] += `, ${h.localName}`;
  }
  return map;
}

export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
