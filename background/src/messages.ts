export interface Message {
  type: keyof MessageTypes;
}

export interface MessageTypes {
  'apply-scratchpad': Message;
  'update-all': Message;
}

export type MessageHandlers = {
  [type in keyof MessageTypes]: (msg: MessageTypes[type]) => void | Promise<void>;
};

export async function sendMessage<T extends keyof MessageTypes>(msg: MessageTypes[T]): Promise<void> {
  await browser.runtime.sendMessage(msg);
}
