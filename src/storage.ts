export interface StorageChange<T> extends browser.storage.StorageChange {
  oldValue?: T;
  newValue?: T;
}

export type StorageChangeHandler<T> = (change: StorageChange<T>) => void | Promise<void>;

export type StorageChangeHandlers = {
  [area in keyof Storage]?: {
    [key in keyof Storage[area]]?: StorageChangeHandler<Storage[area][key]>;
  };
};

export interface Storage {
  sync: SyncStorage;
  local: LocalStorage;
}

export interface SyncStorage {
  stylesheets?: Stylesheet[];
}

export interface Stylesheet {
  url: string;
  host: string;
}

export function getSyncStorage<K extends keyof SyncStorage>(keys?: K | K[]): Promise<SyncStorage> {
  return browser.storage.sync.get(keys) as Promise<SyncStorage>;
}

export function setSyncStorage(items: Partial<SyncStorage>): Promise<void> {
  return browser.storage.sync.set(items);
}

export async function getStylesheets(): Promise<Stylesheet[]> {
  return (await getSyncStorage('stylesheets')).stylesheets || [];
}

export interface LocalStorage {
  stylesheetCache?: StylesheetUrlCache;
}

export interface CachedStylesheet {
  css: string;
  updated: number; // Date.now()
}

export type StylesheetUrlCache = Record<string, CachedStylesheet>;

export function getLocalStorage<K extends keyof LocalStorage>(keys?: K | K[]): Promise<LocalStorage> {
  return browser.storage.local.get(keys) as Promise<LocalStorage>;
}

export function setLocalStorage(items: Partial<LocalStorage>): Promise<void> {
  return browser.storage.local.set(items);
}

export async function getStylesheetCache(): Promise<StylesheetUrlCache> {
  return (await getLocalStorage('stylesheetCache')).stylesheetCache || {};
}
