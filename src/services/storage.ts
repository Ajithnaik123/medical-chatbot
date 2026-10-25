import { User } from '../types';
import { initialUsers } from '../data/initialData';

const STORAGE_KEYS = {
  CURRENT_USER: 'medicare_current_user',
  TOKEN: 'medicare_token',
  LANGUAGE: 'medicare_language',
  TTS_ENABLED: 'medicare_tts_enabled',
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Storage error for ${key}:`, err);
  }
}

export const storage = {
  getCurrentUser(): User {
    const current = safeGet<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!current) {
      const defaultUser = initialUsers[0]; // Ajith
      safeSet(STORAGE_KEYS.CURRENT_USER, defaultUser);
      return defaultUser;
    }
    return current;
  },

  setCurrentUser(user: User | null): void {
    if (user) {
      safeSet(STORAGE_KEYS.CURRENT_USER, user);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getToken(): string {
    return safeGet<string>(STORAGE_KEYS.TOKEN, 'medicare_demo_token');
  },

  setToken(token: string): void {
    safeSet(STORAGE_KEYS.TOKEN, token);
  },

  getLanguage(): 'en' | 'te' | 'hi' | 'es' {
    return safeGet<'en' | 'te' | 'hi' | 'es'>(STORAGE_KEYS.LANGUAGE, 'en');
  },

  setLanguage(lang: 'en' | 'te' | 'hi' | 'es'): void {
    safeSet(STORAGE_KEYS.LANGUAGE, lang);
  },

  isTtsEnabled(): boolean {
    return safeGet<boolean>(STORAGE_KEYS.TTS_ENABLED, false);
  },

  setTtsEnabled(enabled: boolean): void {
    safeSet(STORAGE_KEYS.TTS_ENABLED, enabled);
  },
};
