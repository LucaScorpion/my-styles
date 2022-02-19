export function insertCss(tabId: number, code: string): Promise<void> {
  return browser.tabs.insertCSS(tabId, { code }).catch((e) => console.error(`Could not insert CSS: ${e}`));
}
