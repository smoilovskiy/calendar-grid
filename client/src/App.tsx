import { useState } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from './theme/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { CountrySelect } from './components/CountrySelect/CountrySelect';
import { FilterPopover } from './components/FilterPopover/FilterPopover';
import { AuthModal } from './components/AuthModal/AuthModal';
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

const AuthBtn = styled.button`
  padding: 6px 12px;
  font-size: 0.8rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  &:hover {
    background: var(--hover);
  }
`;

const UserEmail = styled.span`
  font-size: 0.8rem;
  color: var(--text-muted);
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

function TopBarContent({
  country,
  setCountry,
  filterQuery,
  setFilterQuery,
}: {
  country: string;
  setCountry: (v: string) => void;
  filterQuery: string;
  setFilterQuery: (v: string) => void;
}) {
  const { user, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (loading) {
    return (
      <TopBar>
        <CountrySelect value={country} onChange={setCountry} />
        <FilterPopover value={filterQuery} onChange={setFilterQuery} />
        <ThemeToggle />
      </TopBar>
    );
  }

  return (
    <>
      <TopBar>
        {user ? (
          <>
            <UserEmail title={user.email ?? undefined}>{user.email}</UserEmail>
            <AuthBtn type="button" onClick={() => signOut()}>
              Sign out
            </AuthBtn>
          </>
        ) : (
          <AuthBtn type="button" onClick={() => setShowAuthModal(true)}>
            Sign in
          </AuthBtn>
        )}
        <CountrySelect value={country} onChange={setCountry} />
        <FilterPopover value={filterQuery} onChange={setFilterQuery} />
        <ThemeToggle />
      </TopBar>
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </>
  );
}

function App() {
  const [country, setCountry] = useState(getCountryFromLocale);
  const [filterQuery, setFilterQuery] = useState('');

  return (
    <ThemeProvider>
      <AuthProvider>
        <TopBarContent
          country={country}
          setCountry={setCountry}
          filterQuery={filterQuery}
          setFilterQuery={setFilterQuery}
        />
        <CalendarGrid countryCode={country} filterQuery={filterQuery} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
