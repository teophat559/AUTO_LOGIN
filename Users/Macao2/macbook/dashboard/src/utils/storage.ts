import { AUTH_CONFIG } from '../config/auth';

class Storage {
  private static instance: Storage;
  private storage: Storage;

  private constructor() {
    this.storage = window.localStorage;
  }

  static getInstance(): Storage {
    if (!Storage.instance) {
      Storage.instance = new Storage();
    }
    return Storage.instance;
  }

  set(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      this.storage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const serializedValue = this.storage.getItem(key);
      return serializedValue ? JSON.parse(serializedValue) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  // Auth specific methods
  setToken(token: string): void {
    this.set(AUTH_CONFIG.tokenKey, token);
  }

  getToken(): string | null {
    return this.get<string>(AUTH_CONFIG.tokenKey);
  }

  setRefreshToken(token: string): void {
    this.set(AUTH_CONFIG.refreshTokenKey, token);
  }

  getRefreshToken(): string | null {
    return this.get<string>(AUTH_CONFIG.refreshTokenKey);
  }

  clearAuth(): void {
    this.remove(AUTH_CONFIG.tokenKey);
    this.remove(AUTH_CONFIG.refreshTokenKey);
  }
}

export { Storage };
export const storage = Storage.getInstance();