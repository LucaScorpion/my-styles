import { elemById } from './elemById';

export function formInputByName(formId: string, name: string): HTMLInputElement {
  const elem = elemById(formId).querySelector(`input[name="${name}"]`);
  if (!elem) {
    throw new Error(`Could not find input element with name: ${name} in #${formId}`);
  }
  return elem as HTMLInputElement;
}
