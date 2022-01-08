export function elemById(id: string): HTMLElement {
  const elem = document.getElementById(id);
  if (!elem) {
    throw new Error(`Could not find element with id: ${id}`);
  }
  return elem;
}
