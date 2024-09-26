export function escapeLikeString(str: string): string {
  return str.replace(/([%_\\])/g, "\\$1");
}
