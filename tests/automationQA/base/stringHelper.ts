export function FormatString(str: string, val: string) {
  return str.replace(`{0}`, val);
}

export function isEmpty(str) {
  return !str || str.length === 0;
}
