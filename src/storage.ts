export interface SyncStorage {
  stylesheetUrls?: string[];
}

export function getSyncStorage(): Promise<SyncStorage> {
  return browser.storage.sync.get() as Promise<SyncStorage>;
}

export function setSyncStorage(items: Partial<SyncStorage>): Promise<void> {
  return browser.storage.sync.set(items);
}

export interface LocalStorage {
  stylesheetCache?: Record<string, string>;
}

export function getLocalStorage(): Promise<LocalStorage> {
  return browser.storage.local.get() as Promise<LocalStorage>;
}

export function setLocalStorage(items: Partial<LocalStorage>): Promise<void> {
  return browser.storage.local.set(items);
}
