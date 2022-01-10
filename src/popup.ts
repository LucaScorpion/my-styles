import { getStylesheets, setSyncStorage } from './storage';
import { elemById } from './utils/elemById';
import { initTabs } from './components/tabs';
import { sendMessage } from './messages';

(() => {
  // Initialize.
  initTabs(elemById('tabs'), elemById('tabs-content'));
  // noinspection JSIgnoredPromiseFromCall
  displayStylesheets();

  // Event handling.
  (elemById('add-stylesheet') as HTMLFormElement).addEventListener('formdata', function (this, e) {
    importStylesheet(this, e);
  });
  elemById('btn-update-all').addEventListener('click', () => sendMessage({ type: 'update-all' }));
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
  await displayStylesheets();
}
