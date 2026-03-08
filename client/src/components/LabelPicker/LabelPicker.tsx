import styled from '@emotion/styled';
import { LABEL_COLORS, LABEL_IDS } from '../../constants/labelColors';

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const Chip = styled.button<{ $color: string; $selected?: boolean }>`
  width: 28px;
  height: 20px;
  padding: 0;
  border-radius: 4px;
  border: 2px solid ${(p) => (p.$selected ? 'var(--text)' : 'transparent')};
  background: ${(p) => p.$color};
  cursor: pointer;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  &:hover {
    filter: brightness(1.1);
  }
`;

const Label = styled.span`
  font-size: 0.7rem;
  color: var(--text-muted);
  display: block;
  margin-bottom: 2px;
`;

type LabelPickerProps = {
  value: string[];
  onChange: (labels: string[]) => void;
};

export function LabelPicker({ value, onChange }: LabelPickerProps) {
  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((x) => x !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div>
      <Label>Labels</Label>
      <Wrap>
        {LABEL_IDS.map((id) => (
          <Chip
            key={id}
            type="button"
            $color={LABEL_COLORS[id] ?? '#ccc'}
            $selected={value.includes(id)}
            onClick={() => toggle(id)}
            title={id}
            aria-label={`Label ${id}`}
          />
        ))}
      </Wrap>
    </div>
  );
}
