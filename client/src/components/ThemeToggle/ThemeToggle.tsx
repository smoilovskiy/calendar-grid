import styled from '@emotion/styled';
import { useTheme } from '../../theme/ThemeContext';

const Button = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  padding: 8px 12px;
  font-size: 0.875rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  &:hover {
    background: var(--hover);
  }
`;

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </Button>
  );
}
