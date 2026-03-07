import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../api/tasks';
import { getHighlightSegments } from '../../utils/highlightMatch';

const Card = styled.div<{ $isDragging?: boolean }>`
  padding: 6px 8px;
  margin-top: 4px;
  font-size: 0.8rem;
  background: var(--bg-tertiary);
  border-radius: 4px;
  border-left: 3px solid var(--border);
  cursor: grab;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: ${(p) => (p.$isDragging ? 0.5 : 1)};
  &:active {
    cursor: grabbing;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 4px 6px;
  font-size: 0.8rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  color: var(--text);
`;

const Highlight = styled.mark`
  background: #fef08a;
  color: inherit;
  padding: 0 1px;
  border-radius: 2px;
`;

type SortableTaskCardProps = {
  task: Task;
  filterQuery: string;
  onUpdate: (id: string, data: { title?: string }) => void;
  onDelete: (id: string) => void;
};

export function SortableTaskCard({ task, filterQuery, onUpdate, onDelete }: SortableTaskCardProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    setValue(task.title);
  }, [task.title]);

  const save = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdate(task.id, { title: trimmed });
    } else if (!trimmed) {
      onDelete(task.id);
    } else {
      setValue(task.title);
    }
    setEditing(false);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (editing) {
    return (
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save();
          if (e.key === 'Escape') {
            setValue(task.title);
            setEditing(false);
          }
        }}
      />
    );
  }

  const segments = getHighlightSegments(task.title, filterQuery);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      $isDragging={isDragging}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      title="Drag to move, click to edit"
    >
      {segments.map((seg, i) =>
        seg.match ? <Highlight key={i}>{seg.text}</Highlight> : seg.text
      )}
    </Card>
  );
}
