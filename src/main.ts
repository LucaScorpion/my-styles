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
