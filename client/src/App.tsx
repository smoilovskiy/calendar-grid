import { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from './theme/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { CountrySelect } from './components/CountrySelect/CountrySelect';
import { FilterPopover } from './components/FilterPopover/FilterPopover';
import { ActivityLogPopover } from './components/ActivityLogPopover/ActivityLogPopover';
import { CalendarGrid } from './components/CalendarGrid/CalendarGrid';
import { getCountryFromLocale } from './utils/locale';
import { getStoredUserName, setStoredUserName } from './utils/userName';

const TopBar = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
`;

const UserNameInput = styled.input`
  width: 120px;
  padding: 6px 8px;
  font-size: 0.8rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  &::placeholder {
    color: var(--text-muted);
  }
`;

function App() {
  const [country, setCountry] = useState(getCountryFromLocale);
  const [filterQuery, setFilterQuery] = useState('');
  const [userName, setUserName] = useState(() => getStoredUserName());

  const handleUserNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setUserName(v);
    setStoredUserName(v);
  }, []);

  return (
    <ThemeProvider>
      <TopBar>
        <UserNameInput
          type="text"
          value={userName}
          onChange={handleUserNameChange}
          placeholder="Your name"
          title="Used in activity log"
        />
        <CountrySelect value={country} onChange={setCountry} />
        <FilterPopover value={filterQuery} onChange={setFilterQuery} />
        <ActivityLogPopover />
        <ThemeToggle />
      </TopBar>
      <CalendarGrid countryCode={country} filterQuery={filterQuery} />
    </ThemeProvider>
  );
}

export default App;
