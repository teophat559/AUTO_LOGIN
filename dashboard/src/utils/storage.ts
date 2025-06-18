import { AUTH_CONFIG } from '../config/auth';

export interface Storage {
  set<T>(key: string, value: T): void;
  get<T>(key: string): T | null;
  remove(key: string): void;
  clear(): void;
  has(key: string): boolean;
  keys(): string[];
  size(): number;
  // Auth specific methods
  getToken(): string | null;
  setToken(token: string): void;
  removeToken(): void;
  getRefreshToken(): string | null;
  setRefreshToken(token: string): void;
  removeRefreshToken(): void;
  clearAuth(): void;
}

class LocalStorage implements Storage {
  private storage: globalThis.Storage;

  private constructor() {
    this.storage = window.localStorage;
  }

  static getInstance(): Storage {
    return new LocalStorage();
  }

  set<T>(key: string, value: T): void {
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

  has(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }

  keys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  }

  size(): number {
    return this.storage.length;
  }

  // Auth specific methods
  getToken(): string | null {
    return this.storage.getItem(AUTH_CONFIG.tokenKey);
  }

  setToken(token: string): void {
    this.storage.setItem(AUTH_CONFIG.tokenKey, token);
  }

  removeToken(): void {
    this.storage.removeItem(AUTH_CONFIG.tokenKey);
  }

  getRefreshToken(): string | null {
    return this.storage.getItem(AUTH_CONFIG.refreshTokenKey);
  }

  setRefreshToken(token: string): void {
    this.storage.setItem(AUTH_CONFIG.refreshTokenKey, token);
  }

  removeRefreshToken(): void {
    this.storage.removeItem(AUTH_CONFIG.refreshTokenKey);
  }

  clearAuth(): void {
    this.removeToken();
    this.removeRefreshToken();
  }
}

export const storage = LocalStorage.getInstance();

// Convenience functions for auth
export const getToken = (): string | null => storage.getToken();
export const setToken = (token: string): void => storage.setToken(token);
export const removeToken = (): void => storage.removeToken();
export const getRefreshToken = (): string | null => storage.getRefreshToken();
export const setRefreshToken = (token: string): void => storage.setRefreshToken(token);
export const removeRefreshToken = (): void => storage.removeRefreshToken();
export const clearAuth = (): void => storage.clearAuth();