export function fileName(path: string): string {
  return path.substring(path.lastIndexOf('/') + 1);
}
