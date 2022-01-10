import { getStylesheets, setSyncStorage } from './storage';
import { elemById } from './utils/elemById';
import { initTabs } from './components/tabs';

(() => {
  // Initialize.
  initTabs(elemById('tabs'), elemById('tabs-content'));
  // noinspection JSIgnoredPromiseFromCall
  displayStylesheets();

  const importElem = elemById('import-stylesheet');
  const importInput = importElem.getElementsByTagName('input')[0];

  // Add event handlers.
  elemById('btn-import-stylesheet').addEventListener('click', () => {
    importElem.classList.remove('hide');
    importInput.focus();
  });
  importInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      importStylesheet(importElem, importInput);
    }
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

async function importStylesheet(importElem: HTMLElement, input: HTMLInputElement): Promise<void> {
  const stylesheets = await getStylesheets();

  // TODO: Check if the stylesheet is already imported.

  stylesheets.push({ url: input.value });
  await setSyncStorage({ stylesheets });

  // Clear and update.
  input.value = '';
  importElem.classList.add('hide');
  await displayStylesheets();
}
