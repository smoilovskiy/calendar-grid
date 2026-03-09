export type CalendarDay = {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
};

const DAY_NAMES_SUNDAY_FIRST = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_MONDAY_FIRST = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function getDayNames(weekStart: 'sunday' | 'monday'): string[] {
  return weekStart === 'sunday' ? DAY_NAMES_SUNDAY_FIRST : DAY_NAMES_MONDAY_FIRST;
}

/**
 * Returns array of days to display in calendar grid.
 * Includes overflow days from prev/next month to fill rows.
 */
export function getCalendarDays(year: number, month: number, weekStart: 'sunday' | 'monday'): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startOffset = getDayOffset(firstDay.getDay(), weekStart);
  const totalDays = lastDay.getDate();
  const endOffset = 6 - getDayOffset(lastDay.getDay(), weekStart);

  const days: CalendarDay[] = [];
  const totalCells = startOffset + totalDays + endOffset;

  for (let i = 0; i < totalCells; i++) {
    const cellIndex = i - startOffset;
    const date = new Date(year, month, 1 + cellIndex);
    days.push({
      date,
      dayOfMonth: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
    });
  }

  return days;
}

function getDayOffset(jsDay: number, weekStart: 'sunday' | 'monday'): number {
  if (weekStart === 'sunday') {
    return jsDay;
  }
  return (jsDay + 6) % 7;
}
