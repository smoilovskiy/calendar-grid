import styled from '@emotion/styled';
import type { CalendarDay } from '../../utils/calendar';

const Cell = styled.div<{ $isCurrentMonth: boolean }>`
  min-height: 100px;
  padding: 8px;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: ${(p) => (p.$isCurrentMonth ? 'var(--bg)' : 'var(--bg-secondary)')};
`;

const DayNumber = styled.span<{ $isCurrentMonth: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => (p.$isCurrentMonth ? 'var(--text)' : 'var(--text-muted)')};
`;

type DayCellProps = {
  day: CalendarDay;
};

export function DayCell({ day }: DayCellProps) {
  return (
    <Cell $isCurrentMonth={day.isCurrentMonth}>
      <DayNumber $isCurrentMonth={day.isCurrentMonth}>
        {day.dayOfMonth}
      </DayNumber>
    </Cell>
  );
}
