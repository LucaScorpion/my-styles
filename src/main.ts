import { getLocalStorage, getSyncStorage, setLocalStorage, setSyncStorage } from './storage';

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

(async () => {
  const local = await getLocalStorage();
  const sync = await getSyncStorage();

  // TODO: remove debug code
  await setSyncStorage({
    stylesheetUrls: [
      'https://gist.githubusercontent.com/LucaScorpion/6dd6a9b74e8326e420ed8d2a1f0a4635/raw/29151b4f58003e898642e5769b1e92502de64989/infi.nl.css',
      'https://gist.githubusercontent.com/LucaScorpion/6dd6a9b74e8326e420ed8d2a1f0a4635/raw/29151b4f58003e898642e5769b1e92502de64989/infi.nl.css',
      'https://gist.githubusercontent.com/LucaScorpion/6dd6a9b74e8326e420ed8d2a1f0a4635/raw/29151b4f58003e898642e5769b1e92502de64989/infi.nl.css',
    ],
  });

  // Default storage values.
  if (!sync.stylesheetUrls) {
    sync.stylesheetUrls = [];
  }
  if (!local.stylesheetCache) {
    local.stylesheetCache = {};
  }

  for (const url of sync.stylesheetUrls) {
    if (local.stylesheetCache[url] == null) {
      local.stylesheetCache[url] = await loadStylesheetFromUrl(url);
    }
  }

  setLocalStorage(local);
})();

function loadStylesheetFromUrl(url: string): Promise<string> {
  console.debug(`Loading stylesheet from: ${url}`);
  return fetch(url).then((r) => r.text());
}
