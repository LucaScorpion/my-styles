import {
  CachedStylesheet,
  getStylesheetCache,
  setLocalStorage,
  setSyncStorage,
  StylesheetUrlCache,
  SyncStorage,
} from './storage';
import StorageChange = browser.storage.StorageChange;

const stylesPerHostName: Record<string, string> = {
  'infi.nl': `
    body {
      border: 10px solid #f67905 !important;
    }
    body:before {
      content: '';
      position: fixed;
      top: 0; left: 0; bottom: 0; right: 0;
      background: radial-gradient(transparent 55%, #f67905 80%);
      z-index: 999999;
    }
  `,
  'jeroenheijmans.nl': `
    body {
      border: 10px solid hotpink !important;
    }
    body:before {
      content: '';
      position: fixed;
      top: 0; left: 0; bottom: 0; right: 0;
      background: radial-gradient(transparent 55%, hotpink 80%);
      z-index: 999999;
    }
  `,
};

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const uri = new URL(tab.url);
    const code = stylesPerHostName[uri.hostname] ?? '';
    browser.tabs.insertCSS(tabId, { code });
  }
});

// Bootstrap.
(async () => {
  browser.storage.onChanged.addListener(storageChangeListener);

  // TODO: remove debug code
  await setSyncStorage({
    stylesheets: [
      {
        url: 'https://gist.githubusercontent.com/LucaScorpion/6dd6a9b74e8326e420ed8d2a1f0a4635/raw/29151b4f58003e898642e5769b1e92502de64989/infi.nl.css',
      },
      {
        url: 'https://gist.githubusercontent.com/LucaScorpion/6dd6a9b74e8326e420ed8d2a1f0a4635/raw/29151b4f58003e898642e5769b1e92502de64989/infi.nl.css',
      },
    ],
  });
})();

interface Change<T> extends StorageChange {
  oldValue?: T;
  newValue?: T;
}

// The any here is required because we don't know the specific type of each handler.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const storageChangeHandlers: { [area: string]: Record<string, (change: Change<any>) => void> } = {
  sync: {
    stylesheets: async (change: Change<SyncStorage['stylesheets']>) => {
      const cache = await getStylesheetCache();
      const newStyles = change.newValue || [];

      // Build the new cache.
      const stylesheetCache: StylesheetUrlCache = {};
      for (const style of newStyles) {
        stylesheetCache[style.url] = await getStylesheetByUrl(style.url, cache);
      }

      // Store the new cache.
      await setLocalStorage({ stylesheetCache });
    },
  },
};

function storageChangeListener(changes: Record<string, StorageChange>, areaName: string): void {
  Object.entries(changes).forEach(([key, change]) => {
    const handler = (storageChangeHandlers[areaName] || {})[key];
    if (handler) {
      handler(change);
    }
  });
}

function getStylesheetByUrl(url: string, cache: StylesheetUrlCache): Promise<CachedStylesheet> {
  // Check if the stylesheet is in the cache.
  const cached = cache[url];
  if (cached) {
    return Promise.resolve(cached);
  }

  // Cache miss, load the stylesheet.
  return loadStylesheetFromUrl(url);
}

async function loadStylesheetFromUrl(url: string): Promise<CachedStylesheet> {
  console.debug(`Loading stylesheet from: ${url}`);
  return {
    css: await fetch(url).then((r) => r.text()),
    updated: Date.now(),
  };
}
