import { useState } from 'react';
import styled from '@emotion/styled';
import { useHolidays } from '../../hooks/useHolidays';
import { getCalendarDays, getDayNames } from '../../utils/calendar';
import { getWeekStartForCountry } from '../../utils/weekStartByCountry';
import { DayCell } from '../DayCell/DayCell';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--text);
`;

const NavButton = styled.button`
  padding: 8px 16px;
  font-size: 1rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  &:hover {
    background: var(--hover);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  & > *:nth-of-type(7n) {
    border-right: none;
  }
`;

const DayHeader = styled.div`
  padding: 12px;
  background: var(--bg-tertiary);
  font-weight: 600;
  font-size: 0.875rem;
  text-align: center;
  border-bottom: 1px solid var(--border);
  color: var(--text);
`;

type CalendarGridProps = {
  countryCode: string;
};

export function CalendarGrid({ countryCode }: CalendarGridProps) {
  const weekStart = getWeekStartForCountry(countryCode);
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const { getHoliday } = useHolidays(year, countryCode);

  const dayNames = getDayNames(weekStart);
  const days = getCalendarDays(year, month, weekStart);

  const goPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const goNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  return (
    <Container>
      <Header>
        <NavButton type="button" onClick={goPrevMonth}>
          ← Prev
        </NavButton>
        <Title>{MONTH_NAMES[month]} {year}</Title>
        <NavButton type="button" onClick={goNextMonth}>
          Next →
        </NavButton>
      </Header>

      <Grid>
        {dayNames.map((name) => (
          <DayHeader key={name}>{name}</DayHeader>
        ))}
        {days.map((day, index) => (
          <DayCell key={index} day={day} holidayName={getHoliday(day.date)} />
        ))}
      </Grid>
    </Container>
  );
}
