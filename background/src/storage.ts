import { StorageChange } from 'types/dist/StorageChange';
import { Stylesheet } from 'types/dist/Stylesheet';
import { getLocalStorage, getSyncStorage, StylesheetUrlCache } from 'types/dist/storage';

export type StorageChangeHandler<T> = (change: StorageChange<T>) => void | Promise<void>;

export type StorageChangeHandlers = {
  [area in keyof Storage]?: {
    [key in keyof Storage[area]]?: StorageChangeHandler<Storage[area][key]>;
  };
};

export async function getStylesheets(): Promise<Stylesheet[]> {
  return (await getSyncStorage('stylesheets')).stylesheets || [];
}

export async function getStylesheetCache(): Promise<StylesheetUrlCache> {
  return (await getLocalStorage('stylesheetCache')).stylesheetCache || {};
}
