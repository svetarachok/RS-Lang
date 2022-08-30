export function findCorrectAnswPercent(corr: number, incorr: number): string {
  if (corr || incorr) {
    const answers: number = Math.round((corr / (corr + incorr)) * 100);
    return `${answers}%`;
  }
  return '0';
}
