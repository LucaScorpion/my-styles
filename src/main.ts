import {
  CachedStylesheet,
  getStylesheetCache,
  getStylesheets,
  setLocalStorage,
  Storage,
  StorageChange,
  StorageChangeHandler,
  StorageChangeHandlers,
  Stylesheet,
  StylesheetUrlCache,
} from './storage';
import { Message, MessageHandlers } from './messages';
import _OnUpdatedChangeInfo = browser.tabs._OnUpdatedChangeInfo;
import Tab = browser.tabs.Tab;

// ==== Bootstrap ====

let stylesByHostname: Record<string, CachedStylesheet[]> = {};

(async () => {
  // Load the stylesheets from storage.
  stylesByHostname = getStylesByHostname(await getStylesheetCache());

  // Add all event listeners.
  browser.tabs.onUpdated.addListener(tabsUpdateListener);
  browser.storage.onChanged.addListener(storageChangeListener);
  browser.runtime.onMessage.addListener(messageListener);
})();

// ==== End bootstrap ====

function tabsUpdateListener(tabId: number, changeInfo: _OnUpdatedChangeInfo, tab: Tab): void {
  if (changeInfo.status === 'complete' && tab.url) {
    const tabUrl = new URL(tab.url);
    const styles = stylesByHostname[tabUrl.hostname];
    if (styles) {
      for (const style of styles) {
        browser.tabs
          .insertCSS(tabId, { code: style.css })
          .catch((e) => console.error(`Could not insert ${style.stylesheet.url} CSS into ${tabUrl.hostname}: ${e}`));
      }
    }
  }
}

const storageChangeHandlers: StorageChangeHandlers = {
  sync: {
    stylesheets: async (change) => {
      const cache = await getStylesheetCache();
      const newStyles = change.newValue || [];

      const stylesheetCache: StylesheetUrlCache = {};
      for (const style of newStyles) {
        stylesheetCache[style.url] = await getStylesheet(style, cache);
      }

      await setLocalStorage({ stylesheetCache });
    },
  },
  local: {
    stylesheetCache: (change) => {
      stylesByHostname = getStylesByHostname(change.newValue || {});
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
  'update-all': async () => {
    const styles = await getStylesheets();

    const stylesheetCache: StylesheetUrlCache = {};
    for (const style of styles) {
      stylesheetCache[style.url] = await loadStylesheet(style);
    }

    await setLocalStorage({ stylesheetCache });
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

function getStylesheet(stylesheet: Stylesheet, cache: StylesheetUrlCache): Promise<CachedStylesheet> {
  // Check if the stylesheet is in the cache.
  const cached = cache[stylesheet.url];
  if (cached) {
    return Promise.resolve(cached);
  }

  // Cache miss, load the stylesheet.
  return loadStylesheet(stylesheet);
}

async function loadStylesheet(stylesheet: Stylesheet): Promise<CachedStylesheet> {
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

function getStylesByHostname(cache: StylesheetUrlCache): Record<string, CachedStylesheet[]> {
  const result: Record<string, CachedStylesheet[]> = {};

  Object.values(cache).forEach((style) => {
    const newStyles = result[style.stylesheet.host] || [];
    newStyles.push(style);
    result[style.stylesheet.host] = newStyles;
  });

  return result;
}
