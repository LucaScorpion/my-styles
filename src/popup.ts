import { getLocalStorage, getSyncStorage } from './storage';
import { onClick } from './events';
import { elemById } from './utils/elemById';
import { initTabs } from './tabs';

(() => {
  initTabs(elemById('tabs'), elemById('tabs-content'));
  displayStylesheetUrls();

  // Register event handlers.
  onClick('log', async () => {
    console.log(await getLocalStorage());
  });
})();

async function displayStylesheetUrls(): Promise<void> {
  const sync = await getSyncStorage();
  const containerElem = elemById('stylesheet-urls');
  containerElem.replaceChildren();

  (sync.stylesheetUrls || []).forEach((url) => {
    const child = document.createElement('div');
    child.textContent = url.substring(url.lastIndexOf('/') + 1);
    containerElem.appendChild(child);
  });
}
