import styled from '@emotion/styled';
import type { CalendarDay } from '../../utils/calendar';

const Cell = styled.div<{ $isCurrentMonth: boolean }>`
  min-height: 100px;
  padding: 8px;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: ${(p) => (p.$isCurrentMonth ? 'var(--bg)' : 'var(--bg-secondary)')};
  display: flex;
  flex-direction: column;
`;

const TopRow = styled.div`
  flex-shrink: 0;
`;

const DayNumber = styled.span<{ $isCurrentMonth: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => (p.$isCurrentMonth ? 'var(--text)' : 'var(--text-muted)')};
`;

const HolidayLabel = styled.div`
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 4px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type DayCellProps = {
  day: CalendarDay;
  holidayName?: string | null;
};

export function DayCell({ day, holidayName }: DayCellProps) {
  return (
    <Cell $isCurrentMonth={day.isCurrentMonth}>
      <TopRow>
        <DayNumber $isCurrentMonth={day.isCurrentMonth}>
          {day.dayOfMonth}
        </DayNumber>
        {holidayName && <HolidayLabel title={holidayName}>{holidayName}</HolidayLabel>}
      </TopRow>
    </Cell>
  );
}
