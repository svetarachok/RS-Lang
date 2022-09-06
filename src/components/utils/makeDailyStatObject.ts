import {
  Statistic, DailyStat, DailyStatObj, GameStatistic,
} from '../types/interfaces';

export function makeDailyStat(stat: Statistic) {
  const dates: string[] = Object.keys(stat.optional.words);
  const obj = dates.reduce((acc, currentDate: string) => {
    acc[currentDate] = {} as DailyStatObj;
    acc[currentDate].games = { audiocall: {} as GameStatistic, sprint: {} as GameStatistic };
    acc[currentDate].words = stat.optional.words[currentDate];
    acc[currentDate].games.audiocall = stat.optional.games.audiocall[currentDate];
    acc[currentDate].games.sprint = stat.optional.games.sprint[currentDate];
    return acc;
  }, {} as DailyStat);
  const res: [string, DailyStatObj][] = Object.entries(obj as DailyStat);
  return res.reverse();
}
