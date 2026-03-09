import styled from '@emotion/styled';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../api/tasks';
import { getHighlightSegments } from '../../utils/highlightMatch';
import { LABEL_COLORS } from '../../constants/labelColors';

const LabelStripsWrap = styled.div`
  padding: 4px 4px 2px 4px;
  flex-shrink: 0;
`;

const LabelStrips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
`;

const LabelStrip = styled.span<{ $color: string }>`
  display: block;
  width: 10px;
  height: 4px;
  border-radius: 2px;
  background: ${(p) => p.$color};
`;

const CardInner = styled.div`
  padding: 2px 8px 6px 8px;
  font-size: 0.8rem;
  line-height: 1.2;
  white-space: normal;
  word-break: break-word;
  overflow: hidden;
  min-width: 0;
`;

const Card = styled.div<{ $isDragging?: boolean; $isPlaceholder?: boolean }>`
  margin-top: 2px;
  font-size: 0.8rem;
  background: var(--card);
  border-radius: 4px;
  border: 1px solid var(--border-light);
  cursor: grab;
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

function TaskCardLabelStrips({ labels }: { labels?: string[] }) {
  const ids = labels?.length ? labels : [];
  if (ids.length === 0) return null;
  return (
    <LabelStripsWrap>
      <LabelStrips>
        {ids.map((id) => (
          <LabelStrip key={id} $color={LABEL_COLORS[id] ?? '#ccc'} />
        ))}
      </LabelStrips>
    </LabelStripsWrap>
  );
}

export function TaskCardDragPreview({ task, filterQuery }: { task: Task; filterQuery: string }) {
  const segments = getHighlightSegments(task.title, filterQuery);
  return (
    <OverlayCard>
      <TaskCardLabelStrips labels={task.labels} />
      <CardInner>
        {segments.map((seg, i) =>
          seg.match ? <Highlight key={i}>{seg.text}</Highlight> : seg.text
        )}
      </CardInner>
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
      <TaskCardLabelStrips labels={task.labels} />
      <CardInner>
        {segments.map((seg, i) =>
          seg.match ? <Highlight key={i}>{seg.text}</Highlight> : seg.text
        )}
      </CardInner>
    </Card>
  );
}
