import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';
import type { Task } from '../../api/tasks';
import { fetchActivityForTask } from '../../api/activity';
import type { ActivityEntry } from '../../api/activity';
import { LABEL_COLORS } from '../../constants/labelColors';

const LabelStripsWrap = styled.div`
  padding: 5px;
  margin-bottom: 4px;
`;

const LabelStrips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const LabelStrip = styled.span<{ $color: string }>`
  display: block;
  width: 16px;
  height: 6px;
  border-radius: 3px;
  background: ${(p) => p.$color};
`;

const PopoverBox = styled.div`
  position: fixed;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
  min-width: 260px;
  max-width: 340px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 100;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
`;

const TitleText = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  word-break: break-word;
  flex: 1;
  min-width: 0;
`;

const IconButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

const IconBtn = styled.button`
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text-muted);
  cursor: pointer;
  &:hover {
    background: var(--hover);
    color: var(--text);
  }
`;

const Description = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
  white-space: pre-wrap;
  word-break: break-word;
  margin-bottom: 10px;
  line-height: 1.4;
`;

const HistoryTitle = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 6px;
`;

const HistoryList = styled.div`
  font-size: 0.75rem;
  color: var(--text);
`;

const HistoryEntry = styled.div`
  padding: 3px 0;
  border-bottom: 1px solid var(--border);
  line-height: 1.35;
  &:last-child {
    border-bottom: none;
  }
`;

const HistoryTime = styled.span`
  color: var(--text-muted);
  margin-right: 6px;
`;

function formatHistoryTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function formatHistoryAction(entry: ActivityEntry): string {
  const user = entry.user_name || 'Someone';
  switch (entry.action) {
    case 'created':
      return `${user} created`;
    case 'updated':
      return `${user} updated`;
    case 'moved':
      return `${user} moved`;
    case 'deleted':
      return `${user} deleted`;
    default:
      return `${user} ${entry.action}`;
  }
}

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PencilIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

type TaskViewPopoverProps = {
  task: Task;
  anchorRect: DOMRect;
  onClose: () => void;
  onEdit: (task: Task) => void;
};

export function TaskViewPopover({ task, anchorRect, onClose, onEdit }: TaskViewPopoverProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<ActivityEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const openHistory = () => {
    if (!showHistory) {
      setShowHistory(true);
      setHistoryLoading(true);
      fetchActivityForTask(task.id, 10)
        .then(setHistory)
        .catch(() => setHistory([]))
        .finally(() => setHistoryLoading(false));
    } else {
      historyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  useEffect(() => {
    if (showHistory && !historyLoading && historyRef.current) {
      historyRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [showHistory, historyLoading]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (boxRef.current && e.target instanceof Node && !boxRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [onClose]);

  const style: React.CSSProperties = {
    left: Math.max(8, Math.min(anchorRect.left, window.innerWidth - 280)),
    top: anchorRect.bottom + 4,
  };
  if (style.top! + 300 > window.innerHeight) {
    style.top = undefined;
    style.bottom = window.innerHeight - anchorRect.top + 4;
  }

  const handleEditClick = () => {
    onClose();
    onEdit(task);
  };

  const labelIds = task.labels?.length ? task.labels : [];

  const content = (
    <PopoverBox ref={boxRef} style={style} onClick={(e) => e.stopPropagation()}>
      {labelIds.length > 0 && (
        <LabelStripsWrap>
          <LabelStrips>
            {labelIds.map((id) => (
              <LabelStrip key={id} $color={LABEL_COLORS[id] ?? '#ccc'} />
            ))}
          </LabelStrips>
        </LabelStripsWrap>
      )}
      <Header>
        <TitleText>{task.title}</TitleText>
        <IconButtons>
          <IconBtn type="button" onClick={openHistory} title="History of changes" aria-label="History">
            <ClockIcon />
          </IconBtn>
          <IconBtn type="button" onClick={handleEditClick} title="Edit or delete" aria-label="Edit">
            <PencilIcon />
          </IconBtn>
        </IconButtons>
      </Header>
      <Description>{task.description?.trim() || 'No description'}</Description>
      {showHistory && (
        <div ref={historyRef}>
          <HistoryTitle>History</HistoryTitle>
          <HistoryList>
            {historyLoading && (
              <HistoryEntry><HistoryTime>—</HistoryTime>Loading…</HistoryEntry>
            )}
            {!historyLoading && history.length === 0 && (
              <HistoryEntry><HistoryTime>—</HistoryTime>No history</HistoryEntry>
            )}
            {!historyLoading && history.map((entry) => (
              <HistoryEntry key={entry.id}>
                <HistoryTime>{formatHistoryTime(entry.created_at)}</HistoryTime>
                {formatHistoryAction(entry)}
              </HistoryEntry>
            ))}
          </HistoryList>
        </div>
      )}
    </PopoverBox>
  );

  return createPortal(content, document.body);
}
