import { getStylesheets, setSyncStorage } from './storage';
import { elemById } from './utils/elemById';
import { initTabs } from './components/tabs';
import { sendMessage } from './messages';
import { formInputByName } from './utils/formInputByName';

(() => {
  // Initialize.
  initTabs(elemById('tabs'), elemById('tabs-content'));
  initAddTab();
  initStylesTab();

  // Event handling.
  (elemById('add-stylesheet') as HTMLFormElement).addEventListener('formdata', function (this, e) {
    importStylesheet(this, e);
  });
  elemById('btn-update-all').addEventListener('click', () => sendMessage({ type: 'update-all' }));
})();

async function initAddTab(): Promise<void> {
  formInputByName('add-stylesheet', 'url').focus();

  // Set the url of the host input to the host of the active tab.
  const tabs = await browser.tabs.query({ currentWindow: true, active: true });
  if (tabs.length > 0 && tabs[0].url) {
    const tabUrl = new URL(tabs[0].url);
    formInputByName('add-stylesheet', 'host').value = tabUrl.hostname;
  }
}

async function initStylesTab(): Promise<void> {
  const styles = await getStylesheets();
  const containerElem = elemById('stylesheet-urls');
  containerElem.replaceChildren();

  // Update the heading.
  elemById('stylesheet-urls-title').textContent = `${styles.length} Style${styles.length === 1 ? '' : 's'}`;

  // Show all the stylesheet file names.
  styles.forEach((style) => {
    const child = document.createElement('div');
    child.textContent = `${style.url.substring(style.url.lastIndexOf('/') + 1)} (${style.host})`;
    containerElem.appendChild(child);
  });
}

async function importStylesheet(form: HTMLFormElement, ev: FormDataEvent): Promise<void> {
  const stylesheets = await getStylesheets();

  // Get the new stylesheet data.
  stylesheets.push({
    url: (ev.formData.get('url') || '').toString(),
    host: (ev.formData.get('host') || '').toString(),
  });

  // Store it, refresh the layout.
  await setSyncStorage({ stylesheets });
  await initStylesTab();
}
