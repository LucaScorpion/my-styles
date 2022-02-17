export async function getActiveTabId(): Promise<number | undefined> {
  return (await browser.tabs.query({ currentWindow: true, active: true }))[0]?.id;
}
