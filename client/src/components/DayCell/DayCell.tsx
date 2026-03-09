import { useState } from 'react';
import styled from '@emotion/styled';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { CalendarDay } from '../../utils/calendar';
import type { Task } from '../../api/tasks';
import { SortableTaskCard } from '../TaskCard/SortableTaskCard';
import { AddTaskModal } from '../AddTaskModal/AddTaskModal';
import { EditTaskModal } from '../EditTaskModal/EditTaskModal';
import { TaskViewPopover } from '../TaskViewPopover/TaskViewPopover';

const Cell = styled.div<{ $isCurrentMonth: boolean }>`
  position: relative;
  min-height: 100px;
  padding: 8px 8px 32px 4px;
  border-right: 1px solid var(--border-light);
  border-bottom: 1px solid var(--border-light);
  background: ${(p) => (p.$isCurrentMonth ? 'var(--bg-secondary)' : 'var(--bg-tertiary)')};
  display: flex;
  flex-direction: column;
`;

const TopRow = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: baseline;
  gap: 2px;
  min-width: 0;
  overflow: hidden;
`;

const DayNumber = styled.span<{ $isCurrentMonth: boolean }>`
  display: inline-block;
  width: 22px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(p) => (p.$isCurrentMonth ? 'var(--text)' : 'var(--text-muted)')};
  flex-shrink: 0;
  text-align: left;
`;

const HolidayLabel = styled.span`
  font-size: 0.7rem;
  color: #c24141;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  flex: 1 1 0;
`;

const TasksArea = styled.div<{ $isOver?: boolean }>`
  flex: 1;
  min-height: 0;
  margin-top: 2px;
  min-height: 40px;
  border-radius: 4px;
  background: ${(p) => (p.$isOver ? 'var(--hover)' : 'transparent')};
`;

const AddTaskIconBtn = styled.button`
  position: absolute;
  right: 6px;
  bottom: 6px;
  width: 24px;
  height: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  line-height: 1;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  color: var(--text-muted);
  cursor: pointer;
  &:hover {
    background: var(--hover);
    color: var(--text);
  }
`;

type DayCellProps = {
  day: CalendarDay;
  holidayName?: string | null;
  tasks: Task[];
  filterQuery: string;
  onAddTask: (date: string, title: string, description?: string, labels?: string[]) => void;
  onUpdateTask: (id: string, data: { title?: string; date?: string; order?: number; description?: string; labels?: string[] }) => void;
  onDeleteTask: (id: string) => void;
};

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function DayCell({
  day,
  holidayName,
  tasks,
  filterQuery,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: DayCellProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewTask, setViewTask] = useState<Task | null>(null);
  const [viewAnchorRect, setViewAnchorRect] = useState<DOMRect | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const dateKey = toDateKey(day.date);

  const { setNodeRef, isOver } = useDroppable({ id: `cell-${dateKey}` });
  const taskIds = tasks.map((t) => t.id);

  const holidayDisplay = holidayName && holidayName.length > 20
    ? `${holidayName.slice(0, 20)}…`
    : holidayName ?? '';

  const handleAddSubmit = (title: string, description: string, labels: string[]) => {
    onAddTask(dateKey, title, description || undefined, labels);
  };

  const handleEditSave = (title: string, description: string, labels: string[]) => {
    if (!editTask) return;
    onUpdateTask(editTask.id, { title, description: description || undefined, labels });
    setEditTask(null);
  };

  const handleEditDelete = () => {
    if (!editTask) return;
    onDeleteTask(editTask.id);
    setEditTask(null);
  };

  return (
    <Cell $isCurrentMonth={day.isCurrentMonth}>
      <TopRow>
        <DayNumber $isCurrentMonth={day.isCurrentMonth}>
          {day.dayOfMonth}
        </DayNumber>
        {holidayName && (
          <HolidayLabel title={holidayName}>{holidayDisplay}</HolidayLabel>
        )}
      </TopRow>
      <TasksArea ref={setNodeRef} $isOver={isOver}>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks
            .sort((a, b) => a.order - b.order)
            .map((task) => (
              <SortableTaskCard
                key={task.id}
                task={task}
                filterQuery={filterQuery}
                onView={(task, anchorEl) => {
                  setViewTask(task);
                  setViewAnchorRect(anchorEl.getBoundingClientRect());
                }}
              />
            ))}
        </SortableContext>
        <AddTaskIconBtn
          type="button"
          onClick={() => setShowAddModal(true)}
          title="+ Add task"
          aria-label="Add task"
        >
          +
        </AddTaskIconBtn>
      </TasksArea>
      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddSubmit}
        />
      )}
      {viewTask && viewAnchorRect && (
        <TaskViewPopover
          task={viewTask}
          anchorRect={viewAnchorRect}
          onClose={() => { setViewTask(null); setViewAnchorRect(null); }}
          onEdit={(t) => { setViewTask(null); setViewAnchorRect(null); setEditTask(t); }}
        />
      )}
      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onSave={handleEditSave}
          onDelete={handleEditDelete}
        />
      )}
    </Cell>
  );
}
