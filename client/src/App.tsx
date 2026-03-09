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

const Page = styled.div`
  min-height: 100vh;
  background: var(--bg);
`;

const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  background: linear-gradient(90deg, #ffefba, #ffe08a);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  html[data-theme='dark'] & {
    background: linear-gradient(90deg, #4b3b1a, #3a3017);
  }
`;

const TopBarInner = styled.div`
  padding: 6px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`;

const TopBarControls = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const AuthBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 10px;
  font-size: 0.8rem;
  line-height: 1;
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
  line-height: 1;
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
        <TopBarInner>
          <TopBarControls>
            <CountrySelect value={country} onChange={setCountry} />
            <FilterPopover value={filterQuery} onChange={setFilterQuery} />
            <ThemeToggle />
          </TopBarControls>
        </TopBarInner>
      </TopBar>
    );
  }

  return (
    <>
      <TopBar>
        <TopBarInner>
          <TopBarControls>
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
          </TopBarControls>
        </TopBarInner>
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
        <Page>
          <TopBarContent
            country={country}
            setCountry={setCountry}
            filterQuery={filterQuery}
            setFilterQuery={setFilterQuery}
          />
          <CalendarGrid countryCode={country} filterQuery={filterQuery} />
        </Page>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
