export function on<K extends keyof HTMLElementEventMap>(
  elementId: string,
  event: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void
): void {
  const elem = document.getElementById(elementId);
  if (!elem) {
    throw new Error(`Could not get element with id: ${elementId}`);
  }

  elem.addEventListener(event, listener);
}

export function onClick(
  elementId: string,
  listener: (this: HTMLElement, ev: HTMLElementEventMap['click']) => void
): void {
  on(elementId, 'click', listener);
}
