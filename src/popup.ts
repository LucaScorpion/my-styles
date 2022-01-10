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
  const url = input.value;
  const stylesheets = await getStylesheets();

  // Check if the stylesheet is already part of the list.
  const exists = !!stylesheets.find((s) => s.url === url);
  if (exists) {
    // TODO: Show a notification.
    return;
  }

  // Store the new stylesheet.
  stylesheets.push({ url });
  await setSyncStorage({ stylesheets });

  // Clear and update.
  input.value = '';
  importElem.classList.add('hide');
  await displayStylesheets();
}
