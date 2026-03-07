import { useState } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from './theme/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { CountrySelect } from './components/CountrySelect/CountrySelect';
import { CalendarGrid } from './components/CalendarGrid/CalendarGrid';
import { getCountryFromLocale } from './utils/locale';

const TopBar = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
`;

function App() {
  const [country, setCountry] = useState(getCountryFromLocale);

  return (
    <ThemeProvider>
      <TopBar>
        <CountrySelect value={country} onChange={setCountry} />
        <ThemeToggle />
      </TopBar>
      <CalendarGrid countryCode={country} />
    </ThemeProvider>
  );
}

export default App;
