import { Stylesheet } from 'types/dist/Stylesheet';
import { CachedStylesheet } from 'types/dist/CachedStylesheet';
import { StylesheetUrlCache } from 'types/dist/storage';

export function getOrLoadStylesheet(stylesheet: Stylesheet, cache: StylesheetUrlCache): Promise<CachedStylesheet> {
  // Check if the stylesheet is in the cache.
  const cached = cache[stylesheet.url];
  if (cached) {
    return Promise.resolve(cached);
  }

  // Cache miss, load the stylesheet.
  return loadStylesheet(stylesheet);
}

export async function loadStylesheet(stylesheet: Stylesheet): Promise<CachedStylesheet> {
  console.debug(`Loading stylesheet from: ${stylesheet.url}`);

  let css = '';
  try {
    css = await fetch(stylesheet.url).then((r) => r.text());
  } catch (err) {
    console.error(`Could not load stylesheet: ${err}`);
  }

  return {
    stylesheet,
    css,
    updated: Date.now(),
  };
}
