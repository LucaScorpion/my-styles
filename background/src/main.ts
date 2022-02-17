import { MessageHandlers } from './messages';
import { getActiveTabId } from './getActiveTabId';
import { CachedStylesheet } from 'types/dist/CachedStylesheet';
import { getStylesheetCache, getStylesheets, StorageChangeHandlers } from './storage';
import { setLocalStorage, StylesheetUrlCache } from 'types/dist/storage';
import { StorageChange } from 'types/dist/StorageChange';
import { Stylesheet } from 'types/dist/Stylesheet';
import { Message } from 'types/dist/messages';
import _OnUpdatedChangeInfo = browser.tabs._OnUpdatedChangeInfo;
import Tab = browser.tabs.Tab;

// ==== Bootstrap ====

let stylesByHostname: Record<string, CachedStylesheet[]> = {};

(async () => {
  console.debug('Starting My Styles background script...');

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
    insertStylesheets(tabId, stylesByHostname[tabUrl.hostname]);
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
    stylesheetCache: async (change) => {
      const newStylesByHostname = getStylesByHostname(change.newValue || {});

      // Refresh the styles on all tabs.
      const allTabs = await browser.tabs.query({});
      for (const tab of allTabs) {
        if (!tab.id || !tab.url) {
          continue;
        }
        const tabUrl = new URL(tab.url);

        // Remove any previous styles, insert the new styles.
        removeStylesheets(tab.id, stylesByHostname[tabUrl.hostname]);
        insertStylesheets(tab.id, newStylesByHostname[tabUrl.hostname]);
      }

      stylesByHostname = newStylesByHostname;
    },
  },
};

function storageChangeListener(changes: Record<string, StorageChange<unknown>>, areaName: string): void {
  Object.entries(changes).forEach(([key, change]) => {
    const areaHandlers = storageChangeHandlers[areaName as keyof Storage] || {};
    const handler = areaHandlers[key];
    if (handler) {
      handler(change);
    }
  });
}

const messageHandlers: MessageHandlers = {
  'apply-scratchpad': async () => {
    const activeTabId = await getActiveTabId();
    if (!activeTabId) {
      console.error('Cannot apply scratchpad because there is no active tab.');
      return;
    }
    // TODO: Get scratchpad code.
    await insertCss(activeTabId, '');
  },
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

function removeStylesheets(tabId: number, styles: CachedStylesheet[] | undefined): void {
  if (styles) {
    for (const style of styles) {
      console.debug(`Removing CSS: ${style.stylesheet.url}`);
      browser.tabs.removeCSS(tabId, { code: style.css }).catch((e) => console.error(`Could not remove CSS: ${e}`));
    }
  }
}

function insertStylesheets(tabId: number, styles: CachedStylesheet[] | undefined): void {
  if (styles) {
    for (const style of styles) {
      console.debug(`Inserting CSS: ${style.stylesheet.url}`);
      browser.tabs.insertCSS(tabId, { code: style.css }).catch((e) => console.error(`Could not insert CSS: ${e}`));
    }
  }
}

function insertCss(tabId: number, code: string): Promise<void> {
  return browser.tabs.insertCSS(tabId, { code }).catch((e) => console.error(`Could not insert CSS: ${e}`));
}
