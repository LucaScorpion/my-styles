export interface SyncStorage {
  styles: string[];
}

export function getSyncStorage(): Promise<SyncStorage> {
  return browser.storage.sync.get() as Promise<SyncStorage>;
}
