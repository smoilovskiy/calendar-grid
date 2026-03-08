import styled from '@emotion/styled';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../api/tasks';
import { getHighlightSegments } from '../../utils/highlightMatch';

const Card = styled.div<{ $isDragging?: boolean; $isPlaceholder?: boolean }>`
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
  opacity: ${(p) => (p.$isPlaceholder ? 0 : p.$isDragging ? 0.5 : 1)};
  min-width: 0;
  &:active {
    cursor: grabbing;
  }
`;

const Highlight = styled.mark`
  background: #fef08a;
  color: inherit;
  padding: 0 1px;
  border-radius: 2px;
`;

const OverlayCard = styled(Card)`
  cursor: grabbing;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 140px;
  max-width: 200px;
`;

type SortableTaskCardProps = {
  task: Task;
  filterQuery: string;
  onView: (task: Task, anchorEl: HTMLElement) => void;
};

export function TaskCardDragPreview({ task, filterQuery }: { task: Task; filterQuery: string }) {
  const segments = getHighlightSegments(task.title, filterQuery);
  return (
    <OverlayCard>
      {segments.map((seg, i) =>
        seg.match ? <Highlight key={i}>{seg.text}</Highlight> : seg.text
      )}
    </OverlayCard>
  );
}

export function SortableTaskCard({ task, filterQuery, onView }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const segments = getHighlightSegments(task.title, filterQuery);

  return (
    <Card
      ref={setNodeRef}
      style={style}
      $isDragging={false}
      $isPlaceholder={isDragging}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onView(task, e.currentTarget as HTMLElement);
      }}
      title="Drag to move, click to view"
    >
      {segments.map((seg, i) =>
        seg.match ? <Highlight key={i}>{seg.text}</Highlight> : seg.text
      )}
    </Card>
  );
}
