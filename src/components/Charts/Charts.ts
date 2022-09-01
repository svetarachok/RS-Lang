import Chart, { ChartConfiguration, ChartItem } from 'chart.js/auto';
import { api } from '../Model/api';
import { storage } from '../Storage/Storage';
import { StatisticForCarts } from '../types/interfaces';

export class Charts {
  api: typeof api;

  storage: typeof storage;

  constructor() {
    this.api = api;
    this.storage = storage;
  }

  public createChart(id: string, days: string[], wordsCout: number[], descr: string): Chart {
    const ctx = <ChartItem>document.getElementById(id);
    const data = {
      labels: days,
      datasets: [{
        label: descr,
        backgroundColor: '#332A7C',
        borderColor: '#332A7C',
        tension: 0.3,
        data: wordsCout,
      }],
    };

    const config: ChartConfiguration = {
      type: 'bar',
      data,
      options: {
        responsive: false,
        maintainAspectRatio: false,
      },
    };

    return new Chart(ctx, config);
  }

  public async getStatisticForCarts(): Promise<StatisticForCarts | null> {
    const userData = this.storage.getUserIdData();
    const data = await this.api.getStatistic(userData);
    if (!data || typeof data === 'string') return null;
    const dates = Object.keys(data.optional.words);
    const newWords: number[] = [];
    const learnedWords: number[] = [];
    dates.forEach((date, index) => {
      newWords.push(data.optional.words[date].newWords);
      if (index === 0) learnedWords.push(data.optional.words[date].learnedWords);
      else learnedWords.push(data.optional.words[date].learnedWords + learnedWords[index - 1]);
    });
    const result = { dates, newWords, learnedWords };
    return result;
  }
}
