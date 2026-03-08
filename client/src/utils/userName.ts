const STORAGE_KEY = 'calendar_user_name';

export function getStoredUserName(): string {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return typeof v === 'string' && v.trim() ? v.trim().slice(0, 100) : 'Anonymous';
  } catch {
    return 'Anonymous';
  }
}

export function setStoredUserName(name: string): void {
  try {
    const v = name.trim().slice(0, 100);
    if (v) localStorage.setItem(STORAGE_KEY, v);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
