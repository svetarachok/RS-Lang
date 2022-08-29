import Chart, { ChartConfiguration, ChartItem } from 'chart.js/auto';
import { api } from '../Model/api';
import { storage } from '../Storage/Storage';
import { StatisticForCarts, StatisticResponse } from '../types/interfaces';

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
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
        data: wordsCout,
      }],
    };

    const config: ChartConfiguration = {
      type: 'line',
      data,
      options: {
        responsive: false,
        maintainAspectRatio: false,
      },
    };

    return new Chart(ctx, config);
  }

  private async getStatisticForChart(): Promise<StatisticResponse> {
    return await this.api.getStatistic(this.storage.getUserIdData()) as StatisticResponse;
  }

  public async getStatisticForCarts(): Promise<StatisticForCarts> {
    const data = await this.getStatisticForChart();
    const dates = Object.keys(data.optional.words);
    const newWords: number[] = [];
    const learnedWords: number[] = [];
    dates.forEach((date) => {
      newWords.push(data.optional.words[date].newWords);
      learnedWords.push(data.optional.words[date].learnedWords);
    });
    const result = { dates, newWords, learnedWords };
    return result;
  }
}
