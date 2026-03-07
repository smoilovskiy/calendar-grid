import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import type { Task } from '../../api/tasks';

const Card = styled.div`
  padding: 6px 8px;
  margin-top: 4px;
  font-size: 0.8rem;
  background: var(--bg-tertiary);
  border-radius: 4px;
  border-left: 3px solid var(--border);
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

type TaskCardProps = {
  task: Task;
  onUpdate: (id: string, data: { title?: string }) => void;
  onDelete: (id: string) => void;
};

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

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

  return (
    <Card
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {task.title}
    </Card>
  );
}
