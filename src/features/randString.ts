export function randString(length = 8) {
  return Math.random().toString(16).substr(2, length);
}