import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { fetchActivity } from '../../api/activity';
import type { ActivityEntry } from '../../api/activity';

const Wrap = styled.div`
  position: relative;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
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
  width: 320px;
  max-height: 360px;
  overflow-y: auto;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 20;
`;

const Title = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--text);
`;

const Entry = styled.div`
  font-size: 0.75rem;
  color: var(--text);
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
  line-height: 1.35;
  &:last-child {
    border-bottom: none;
  }
`;

const Time = styled.span`
  color: var(--text-muted);
  margin-right: 6px;
`;

const ErrorMsg = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
`;

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) {
      return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function formatAction(entry: ActivityEntry): string {
  const user = entry.user_name || 'Someone';
  const title = entry.task_title ? `"${entry.task_title}"` : 'task';
  switch (entry.action) {
    case 'created':
      return `${user} created ${title}`;
    case 'updated':
      return `${user} updated ${title}`;
    case 'moved':
      return `${user} moved ${title}`;
    case 'deleted':
      return `${user} deleted ${title}`;
    default:
      return `${user} ${entry.action} ${title}`;
  }
}

const HistoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export function ActivityLogPopover() {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    fetchActivity(50)
      .then(setList)
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <Wrap ref={wrapRef}>
      <Button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Activity log"
        aria-expanded={open}
        title="Activity log"
      >
        <HistoryIcon />
      </Button>
      {open && (
        <Popover onClick={(e) => e.stopPropagation()}>
          <Title>Activity</Title>
          {loading && <ErrorMsg>Loading…</ErrorMsg>}
          {error && <ErrorMsg>{error}</ErrorMsg>}
          {!loading && !error && list.length === 0 && <ErrorMsg>No activity yet.</ErrorMsg>}
          {!loading && !error && list.map((entry) => (
            <Entry key={entry.id}>
              <Time>{formatTime(entry.created_at)}</Time>
              {formatAction(entry)}
            </Entry>
          ))}
        </Popover>
      )}
    </Wrap>
  );
}
