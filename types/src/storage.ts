import { Stylesheet } from './Stylesheet';
import { CachedStylesheet } from './CachedStylesheet';

export interface Storage {
  sync: SyncStorage;
  local: LocalStorage;
}

export interface SyncStorage {
  stylesheets?: Stylesheet[];
}

export interface LocalStorage {
  stylesheetCache?: StylesheetUrlCache;
}

export type StylesheetUrlCache = Record<string, CachedStylesheet>;

export function getSyncStorage<K extends keyof SyncStorage>(keys?: K | K[]): Promise<SyncStorage> {
  return browser.storage.sync.get(keys) as Promise<SyncStorage>;
}

export function setSyncStorage(items: Partial<SyncStorage>): Promise<void> {
  return browser.storage.sync.set(items);
}

export function getLocalStorage<K extends keyof LocalStorage>(keys?: K | K[]): Promise<LocalStorage> {
  return browser.storage.local.get(keys) as Promise<LocalStorage>;
}

export function setLocalStorage(items: Partial<LocalStorage>): Promise<void> {
  return browser.storage.local.set(items);
}
