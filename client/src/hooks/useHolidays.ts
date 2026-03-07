import { useState, useEffect, useCallback } from 'react';
import { fetchHolidays, holidaysByDate, dateKey } from '../api/holidays';
import { getCountryFromLocale } from '../utils/locale';

export function useHolidays(year: number, countryCode?: string) {
  const [localeCountry] = useState(getCountryFromLocale);
  const country = countryCode ?? localeCountry;
  const [byDate, setByDate] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async (y: number) => {
    try {
      const list = await fetchHolidays(y, country);
      return holidaysByDate(list);
    } catch (e) {
      return {};
    }
  }, [country]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const years = [year - 1, year, year + 1];
    Promise.all(years.map((y) => load(y)))
      .then(([prev, curr, next]) => {
        setByDate({ ...prev, ...curr, ...next });
      })
      .catch((e) => setError(e instanceof Error ? e : new Error('Failed to load holidays')))
      .finally(() => setLoading(false));
  }, [year, load]);

  const getHoliday = useCallback((date: Date) => byDate[dateKey(date)] ?? null, [byDate]);

  return { getHoliday, loading, error };
}
