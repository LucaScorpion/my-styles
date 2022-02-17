export interface Message {
  type: keyof MessageTypes;
}

export interface MessageTypes {
  'apply-scratchpad': Message;
  'update-all': Message;
}
