import { useState } from 'react';
import styled from '@emotion/styled';
import type { CalendarDay } from '../../utils/calendar';
import type { Task } from '../../api/tasks';
import { TaskCard } from '../TaskCard/TaskCard';

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

const TasksArea = styled.div`
  flex: 1;
  min-height: 0;
  margin-top: 6px;
`;

const AddTaskBtn = styled.button`
  width: 100%;
  margin-top: 4px;
  padding: 4px;
  font-size: 0.75rem;
  border: 1px dashed var(--border);
  border-radius: 4px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  &:hover {
    background: var(--hover);
    color: var(--text);
  }
`;

const AddTaskInput = styled.input`
  width: 100%;
  margin-top: 4px;
  padding: 4px 6px;
  font-size: 0.8rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  color: var(--text);
`;

type DayCellProps = {
  day: CalendarDay;
  holidayName?: string | null;
  tasks: Task[];
  onAddTask: (date: string, title: string) => void;
  onUpdateTask: (id: string, data: { title?: string; date?: string; order?: number }) => void;
  onDeleteTask: (id: string) => void;
};

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function DayCell({
  day,
  holidayName,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: DayCellProps) {
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const dateKey = toDateKey(day.date);

  const submitAdd = () => {
    const t = newTitle.trim();
    if (t) {
      onAddTask(dateKey, t);
      setNewTitle('');
    }
    setAdding(false);
  };

  return (
    <Cell $isCurrentMonth={day.isCurrentMonth}>
      <TopRow>
        <DayNumber $isCurrentMonth={day.isCurrentMonth}>
          {day.dayOfMonth}
        </DayNumber>
        {holidayName && <HolidayLabel title={holidayName}>{holidayName}</HolidayLabel>}
      </TopRow>
      <TasksArea>
        {tasks
          .sort((a, b) => a.order - b.order)
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={(id, data) => onUpdateTask(id, data)}
              onDelete={onDeleteTask}
            />
          ))}
        {adding ? (
          <AddTaskInput
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={submitAdd}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitAdd();
              if (e.key === 'Escape') {
                setNewTitle('');
                setAdding(false);
              }
            }}
            placeholder="Task title..."
          />
        ) : (
          <AddTaskBtn type="button" onClick={() => setAdding(true)}>
            + Add task
          </AddTaskBtn>
        )}
      </TasksArea>
    </Cell>
  );
}
