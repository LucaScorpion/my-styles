import { Stylesheet } from './Stylesheet';

export interface CachedStylesheet {
  stylesheet: Stylesheet;
  css: string;
  updated: number; // Date.now()
}
