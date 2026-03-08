import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { LabelPicker } from '../LabelPicker/LabelPicker';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Box = styled.div`
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px;
  min-width: 280px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`;

const TitleLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--text);
`;

const DescLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 4px;
  margin-top: 12px;
  color: var(--text);
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  font-size: 0.875rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  box-sizing: border-box;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px 10px;
  font-size: 0.875rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  box-sizing: border-box;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

const Btn = styled.button`
  padding: 8px 16px;
  font-size: 0.875rem;
  border-radius: 6px;
  cursor: pointer;
`;

const CancelBtn = styled(Btn)`
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  &:hover {
    background: var(--hover);
  }
`;

const SubmitBtn = styled(Btn)`
  border: none;
  background: #2563eb;
  color: white;
  &:hover {
    background: #1d4ed8;
  }
`;

type AddTaskModalProps = {
  onClose: () => void;
  onSubmit: (title: string, description: string, labels: string[]) => void;
};

export function AddTaskModal({ onClose, onSubmit }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [labels, setLabels] = useState<string[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (t) {
      onSubmit(t, description.trim(), labels);
      onClose();
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Box onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <TitleLabel htmlFor="add-task-title">Title</TitleLabel>
          <Input
            id="add-task-title"
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
          />
          <DescLabel htmlFor="add-task-desc">Description</DescLabel>
          <Textarea
            id="add-task-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
          <LabelPicker value={labels} onChange={setLabels} />
          <Actions>
            <CancelBtn type="button" onClick={onClose}>
              Cancel
            </CancelBtn>
            <SubmitBtn type="submit">Add task</SubmitBtn>
          </Actions>
        </form>
      </Box>
    </Overlay>
  );
}
