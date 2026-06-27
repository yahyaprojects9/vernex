import type { StorageAdapter } from "@/adapters/storage/StorageAdapter";

export class LocalStorageAdapter implements StorageAdapter {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  }
}

export const localStorageAdapter = new LocalStorageAdapter();
