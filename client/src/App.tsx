import { ThemeProvider } from './theme/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { CalendarGrid } from './components/CalendarGrid/CalendarGrid';

function App() {
  return (
    <ThemeProvider>
      <ThemeToggle />
      <CalendarGrid />
    </ThemeProvider>
  );
}

export default App;
