import { Message, MessageTypes } from 'types/dist/messages';
import { getActiveTabId } from './getActiveTabId';
import { getStylesheets } from './storage';
import { setLocalStorage, StylesheetUrlCache } from 'types/dist/storage';
import { loadStylesheet } from './stylesheets';
import { insertCss } from './insertCss';

export type MessageHandlers = {
  [type in keyof MessageTypes]: (msg: MessageTypes[type]) => void | Promise<void>;
};

export function messageListener(msg: Message): void {
  const handler = messageHandlers[msg.type];
  if (handler) {
    handler(msg);
  } else {
    console.error(`Unknown message:\n${JSON.stringify(msg, null, 2)}`);
  }
}

const messageHandlers: MessageHandlers = {
  'apply-scratchpad': async () => {
    const activeTabId = await getActiveTabId();
    if (!activeTabId) {
      console.error('Cannot apply scratchpad because there is no active tab.');
      return;
    }
    // TODO: Get scratchpad code.
    await insertCss(activeTabId, '');
  },
  'update-all': async () => {
    const styles = await getStylesheets();

    const stylesheetCache: StylesheetUrlCache = {};
    for (const style of styles) {
      stylesheetCache[style.url] = await loadStylesheet(style);
    }

    await setLocalStorage({ stylesheetCache });
  },
};
