export interface StorageChange<T> extends browser.storage.StorageChange {
  oldValue?: T;
  newValue?: T;
}
