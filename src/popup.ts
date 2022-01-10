import { getStylesheets } from './storage';
import { elemById } from './utils/elemById';
import { initTabs } from './components/tabs';

(() => {
  // Initialize.
  initTabs(elemById('tabs'), elemById('tabs-content'));
  // noinspection JSIgnoredPromiseFromCall
  displayStylesheets();

  // Add event handlers.
  elemById('btn-import-stylesheet').addEventListener('click', () => {
    const importElem = elemById('import-stylesheet');
    importElem.classList.remove('hide');
    importElem.getElementsByTagName('input')[0].focus();
  });
})();

async function displayStylesheets(): Promise<void> {
  const styles = await getStylesheets();
  const containerElem = elemById('stylesheet-urls');
  containerElem.replaceChildren();

  // Update the heading.
  elemById('stylesheet-urls-title').textContent = `${styles.length} Style${styles.length === 1 ? '' : 's'}`;

  // Show all the stylesheet file names.
  styles.forEach((style) => {
    const child = document.createElement('div');
    child.textContent = style.url.substring(style.url.lastIndexOf('/') + 1);
    containerElem.appendChild(child);
  });
}
