import Chart, { ChartConfiguration, ChartItem } from 'chart.js/auto';

export class Charts {
  public createChart(id: string, days: string[], wordsCout: number[], descr: string): Chart {
    const ctx = <ChartItem>document.getElementById(id);
    const data = {
      labels: days,
      datasets: [{
        label: descr,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgb(75, 192, 192)',
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
}
