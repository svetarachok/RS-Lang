export function findCorrectAnswPercent(corr: number, incorr: number): number {
  if (corr || incorr) {
    const answers: number = (corr / (corr * incorr)) * 100;
    return answers;
  }
  return 0;
}
