import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { fetchCountries } from '../../api/countries';

const Select = styled.select`
  padding: 8px 12px;
  font-size: 0.875rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  min-width: 160px;
  &:hover {
    background: var(--hover);
  }
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
  );
}
