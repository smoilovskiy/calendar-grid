import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { fetchCountries } from '../../api/countries';

const Wrap = styled.div`
  position: relative;
  display: inline-block;
`;

const Select = styled.select`
  height: 32px;
  padding: 0 28px 0 10px;
  font-size: 0.875rem;
  line-height: 1;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  min-width: 150px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  &:hover {
    background: var(--hover);
  }
`;

const Arrow = styled.span`
  pointer-events: none;
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid var(--text-muted);
`;

type CountrySelectProps = {
  value: string;
  onChange: (countryCode: string) => void;
};

export function CountrySelect({ value, onChange }: CountrySelectProps) {
  const [list, setList] = useState<{ countryCode: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries()
      .then((data) => [...data].sort((a, b) => a.name.localeCompare(b.name)))
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <Wrap>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Country for holidays"
      >
        {list.map((c) => (
          <option key={c.countryCode} value={c.countryCode}>
            {c.name}
          </option>
        ))}
      </Select>
      <Arrow />
    </Wrap>
  );
}
