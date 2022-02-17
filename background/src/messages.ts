import { MessageTypes } from 'types/dist/messages';

export type MessageHandlers = {
  [type in keyof MessageTypes]: (msg: MessageTypes[type]) => void | Promise<void>;
};
