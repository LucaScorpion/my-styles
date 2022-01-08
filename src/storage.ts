export interface SyncStorage {
  stylesheetUrls?: string[];
}

export function getSyncStorage<K extends keyof SyncStorage>(keys?: K | K[]): Promise<SyncStorage> {
  return browser.storage.sync.get(keys) as Promise<SyncStorage>;
}

export function setSyncStorage(items: Partial<SyncStorage>): Promise<void> {
  return browser.storage.sync.set(items);
}

export interface LocalStorage {
  stylesheetCache?: StylesheetUrlCache;
}

export interface Stylesheet {
  css: string;
  updated: number; // Date.now()
}

export type StylesheetUrlCache = Record<string, Stylesheet>;

export function getLocalStorage<K extends keyof LocalStorage>(keys?: K | K[]): Promise<LocalStorage> {
  return browser.storage.local.get(keys) as Promise<LocalStorage>;
}

export function setLocalStorage(items: Partial<LocalStorage>): Promise<void> {
  return browser.storage.local.set(items);
}

export async function getStylesheetCache(): Promise<StylesheetUrlCache> {
  return (await getLocalStorage('stylesheetCache')).stylesheetCache || {};
}