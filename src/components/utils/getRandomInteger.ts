export function randomInteger(min: number, max: number) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}
