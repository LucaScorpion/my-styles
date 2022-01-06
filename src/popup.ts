import { getLocalStorage, getSyncStorage } from './storage';
import { onClick } from './events';

(() => {
  displayStylesheetUrls();

  // Register event handlers.
  onClick('log', async () => {
    console.log(await getLocalStorage());
  });
})();

async function displayStylesheetUrls(): Promise<void> {
  const sync = await getSyncStorage();
  const containerElem = document.getElementById('stylesheet-urls')!;
  containerElem.replaceChildren();

  (sync.stylesheetUrls || []).forEach((url) => {
    const child = document.createElement('div');
    child.textContent = url.substring(url.lastIndexOf('/') + 1);
    containerElem.appendChild(child);
  });
}
