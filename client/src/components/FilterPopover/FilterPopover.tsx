import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';

const Wrap = styled.div`
  position: relative;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  &:hover {
    background: var(--hover);
  }
`;

const Popover = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 6px;
  padding: 12px;
  min-width: 200px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 20;
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

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

type FilterPopoverProps = {
  value: string;
  onChange: (value: string) => void;
};

export function FilterPopover({ value, onChange }: FilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, [open]);

  return (
    <Wrap ref={wrapRef}>
      <Button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Filter tasks"
        aria-expanded={open}
      >
        <FilterIcon />
      </Button>
      {open && (
        <Popover onClick={(e) => e.stopPropagation()}>
          <Input
            type="text"
            placeholder="Search tasks..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
          />
        </Popover>
      )}
    </Wrap>
  );
}
