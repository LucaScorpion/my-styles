import {
  CachedStylesheet,
  getStylesheetCache,
  setLocalStorage,
  setSyncStorage,
  Storage,
  StorageChange,
  StorageChangeHandler,
  StorageChangeHandlers,
  StylesheetUrlCache,
  SyncStorage,
} from './storage';
import { Message, MessageHandlers } from './messages';

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

  // Listen for messages.
  browser.runtime.onMessage.addListener(messageListener);
})();

const storageChangeHandlers: StorageChangeHandlers = {
  sync: {
    stylesheets: async (change: StorageChange<SyncStorage['stylesheets']>) => {
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

function storageChangeListener(changes: Record<string, StorageChange<unknown>>, areaName: string): void {
  Object.entries(changes).forEach(([key, change]) => {
    // The `any` here is required because we don't know which set of handlers is returned,
    // and we can't use `key` to get the right type either.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const areaHandlers: Record<string, StorageChangeHandler<any>> = storageChangeHandlers[areaName as keyof Storage] ||
    {};
    const handler = areaHandlers[key];
    if (handler) {
      handler(change);
    }
  });
}

const messageHandlers: MessageHandlers = {
  'update-all': () => {
    // TODO
    console.log('Updating all');
  },
};

function messageListener(msg: Message): void {
  const handler = messageHandlers[msg.type];
  if (handler) {
    handler(msg);
  } else {
    console.error(`Unknown message:\n${JSON.stringify(msg, null, 2)}`);
  }
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
