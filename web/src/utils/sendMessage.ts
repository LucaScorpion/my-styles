import { MessageTypes } from 'types/dist/messages';

export async function sendMessage<T extends keyof MessageTypes>(msg: MessageTypes[T]): Promise<void> {
  await browser.runtime.sendMessage(msg);
}
