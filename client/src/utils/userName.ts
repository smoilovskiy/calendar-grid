import { auth } from '../firebase';

const STORAGE_KEY = 'calendar_user_name';

/** Prefer Firebase displayName then email when signed in, else localStorage name or Anonymous. Used in activity_log as user_name. */
export function getStoredUserName(): string {
  try {
    const u = auth.currentUser;
    if (u?.displayName?.trim()) return u.displayName.trim().slice(0, 100);
    if (u?.email?.trim()) return u.email.trim().slice(0, 100);
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
