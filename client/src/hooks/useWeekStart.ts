import { useState, useEffect } from 'react';

export type WeekStart = 'sunday' | 'monday';

/**
 * Detects week start day from user's locale.
 * US: Sunday. Most other countries: Monday.
 * Uses Intl.Locale.weekInfo when available, falls back to locale string.
 */
export function useWeekStart(): WeekStart {
  const [weekStart, setWeekStart] = useState<WeekStart>(() => getWeekStartFromLocale());

  useEffect(() => {
    setWeekStart(getWeekStartFromLocale());
  }, []);

  return weekStart;
}

function getWeekStartFromLocale(): WeekStart {
  try {
    const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
    const localeObj = new Intl.Locale(locale);
    const weekInfo = (localeObj as Intl.Locale & { weekInfo?: { firstDay: number } }).weekInfo;

    if (weekInfo?.firstDay === 7) return 'sunday';
    if (weekInfo?.firstDay === 1) return 'monday';
    return locale.startsWith('en-US') ? 'sunday' : 'monday';
  } catch {
    return 'monday';
  }
}
