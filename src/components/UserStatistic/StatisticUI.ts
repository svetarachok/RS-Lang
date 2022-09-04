import { api } from '../Model/api';
import { storage } from '../Storage/Storage';
import { DailyStatObj } from '../types/interfaces';
import createNode from '../utils/createNode';
import { DayStatUI } from './DayStatUI';

export class StatisticUI {
  api: typeof api;

  storage: typeof storage;

  dailyWrapper: HTMLElement;

  // mainWrapper: HTMLElement;

  constructor() {
    this.api = api;
    this.storage = storage;
    // this.mainWrapper = createNode({ tag: 'div', classes: ['wrapper_statistic'] });
    this.dailyWrapper = createNode({ tag: 'div', classes: ['wrapper_daily-stat'] });
  }

  public async drawDailyStat() {
    this.dailyWrapper.innerHTML = '';
    const data: [string, DailyStatObj][] = await this.api.getStatDataForRender();
    if (data.length) {
      data.shift();
      data.forEach((date) => {
        const day = new DayStatUI(date);
        const card = day.drawDayStat();
        this.dailyWrapper.append(card);
      });
      return this.dailyWrapper;
    } this.dailyWrapper.innerHTML = '<p>У вас пока нет статистики. Сыграйте в игру и она появится.</p>';
    return this.dailyWrapper;
  }

  public async drawTodayStat() {
    const data: [string, DailyStatObj][] = await this.api.getStatDataForRender();
    if (data.length) {
      const dayUi = new DayStatUI(data.shift() as [string, DailyStatObj]);
      const dailyCard = dayUi.drawFirstDayStat();
      return dailyCard;
    }
    // this.dailyWrapper.innerHTML = '';
    return this.dailyWrapper;
  }
}
