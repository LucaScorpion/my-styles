export type ClassName = string | undefined | false;

export function classNames(...classList: ClassName[]): string {
  return classList.filter((c) => !!c).join(' ');
}
