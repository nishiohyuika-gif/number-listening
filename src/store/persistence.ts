import type { PersistStorage, StorageValue } from 'zustand/middleware';

/**
 * Safe storage: tries localStorage, falls back to in-memory Map if blocked
 * (e.g., sandboxed iframes, Claude artifact environment).
 */
function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    const test = '__test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return window.localStorage;
  } catch {
    return null;
  }
}

const memoryStore = new Map<string, string>();

const fallbackStorage: Storage = {
  get length() { return memoryStore.size; },
  clear: () => memoryStore.clear(),
  getItem: (key) => memoryStore.get(key) ?? null,
  key: (idx) => Array.from(memoryStore.keys())[idx] ?? null,
  removeItem: (key) => { memoryStore.delete(key); },
  setItem: (key, value) => { memoryStore.set(key, value); },
};

const storage = getStorage() ?? fallbackStorage;

export function makePersistStorage<T>(): PersistStorage<T> {
  return {
    getItem: (name) => {
      const raw = storage.getItem(name);
      if (raw === null) return null;
      try {
        return JSON.parse(raw) as StorageValue<T>;
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        storage.setItem(name, JSON.stringify(value));
      } catch {
        /* quota or serialization issues — ignore */
      }
    },
    removeItem: (name) => storage.removeItem(name),
  };
}
