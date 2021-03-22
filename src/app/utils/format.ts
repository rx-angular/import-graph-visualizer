export function filenameFromPath(path: string): string {
  const files = path.split('/');
  return files[files.length - 1];
}

export function dirnameFromPath(path: string): string {
  return path.replace(/\/[^/]$/, '/');
}
