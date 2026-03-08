import { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useHolidays } from '../../hooks/useHolidays';
import { getCalendarDays, getDayNames } from '../../utils/calendar';
import { getWeekStartForCountry } from '../../utils/weekStartByCountry';
import { DayCell } from '../DayCell/DayCell';
import { TaskCardDragPreview } from '../TaskCard/SortableTaskCard';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../api/tasks';
import type { Task } from '../../api/tasks';
import { dateKey } from '../../utils/dateKey';

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
  filterQuery: string;
};

export function CalendarGrid({ countryCode, filterQuery }: CalendarGridProps) {
  const weekStart = getWeekStartForCountry(countryCode);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const { getHoliday } = useHolidays(year, countryCode);

  const dayNames = getDayNames(weekStart);
  const days = getCalendarDays(year, month, weekStart);

  const dateFrom = dateKey(days[0]!.date);
  const dateTo = dateKey(days[days.length - 1]!.date);

  const loadTasks = useCallback(async () => {
    try {
      const list = await fetchTasks(dateFrom, dateTo);
      setTasks(list);
    } catch {
      setTasks([]);
    }
  }, [dateFrom, dateTo]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = useCallback(async (date: string, title: string, description?: string, labels?: string[]) => {
    try {
      const created = await createTask(title, date, 0, description, labels);
      setTasks((prev) => [...prev, created]);
    } catch {
      // ignore
    }
  }, []);

  const handleUpdateTask = useCallback(async (id: string, data: { title?: string; date?: string; order?: number; description?: string; labels?: string[] }) => {
    try {
      const updated = await updateTask(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      // ignore
    }
  }, []);

  const handleDeleteTask = useCallback(async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      // ignore
    }
  }, []);

  const tasksByDate = tasks.reduce<Record<string, Task[]>>((acc, t) => {
    if (!acc[t.date]) acc[t.date] = [];
    acc[t.date].push(t);
    return acc;
  }, {});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined;
    if (task) setActiveTask(task);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null);
      const { active, over } = event;
      if (!over) return;
      const draggedTask = active.data.current?.task as Task | undefined;
      if (!draggedTask) return;

      let targetDate: string;
      let targetOrder: number;

      if (String(over.id).startsWith('cell-')) {
        targetDate = String(over.id).slice(5);
        targetOrder = 0;
      } else {
        const targetTask = tasks.find((t) => t.id === over.id);
        if (!targetTask) return;
        targetDate = targetTask.date;
        targetOrder = targetTask.order + 1;
      }

      if (draggedTask.date === targetDate && draggedTask.order === targetOrder) return;
      handleUpdateTask(draggedTask.id, { date: targetDate, order: targetOrder });
    },
    [tasks, handleUpdateTask]
  );

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

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Grid>
          {dayNames.map((name) => (
            <DayHeader key={name}>{name}</DayHeader>
          ))}
          {days.map((day, index) => (
            <DayCell
              key={index}
              day={day}
              holidayName={getHoliday(day.date)}
              tasks={tasksByDate[dateKey(day.date)] ?? []}
              filterQuery={filterQuery}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </Grid>
        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <TaskCardDragPreview task={activeTask} filterQuery={filterQuery} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Container>
  );
}
