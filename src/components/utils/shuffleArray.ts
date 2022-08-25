export function shuffleArray<T>(array: T[]) {
  const shuffledArray = [...array].sort(() => Math.random() - 0.5);
  return shuffledArray;
}
