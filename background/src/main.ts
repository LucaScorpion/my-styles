import { messageListener } from './messages';
import { CachedStylesheet } from 'types/dist/CachedStylesheet';
import { getStylesheetCache, StorageChangeHandlers } from './storage';
import { setLocalStorage, StylesheetUrlCache } from 'types/dist/storage';
import { StorageChange } from 'types/dist/StorageChange';
import { getOrLoadStylesheet } from './stylesheets';
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
        stylesheetCache[style.url] = await getOrLoadStylesheet(style, cache);
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
