import { api } from '../Model/api';
import { storage } from '../Storage/Storage';
import { DailyStatObj, StatisticResponse } from '../types/interfaces';
import createNode from '../utils/createNode';
import { makeDailyStat } from '../utils/makeDailyStatObject';
import { DayStatUI } from './DayStatUI';

export class StatisticUI {
  api: typeof api;

  storage: typeof storage;

  dailyWrapper: HTMLElement;

  firstDayWrapper: HTMLElement;

  mainWrapper: HTMLElement;

  constructor() {
    this.api = api;
    this.storage = storage;
    this.mainWrapper = createNode({ tag: 'div', classes: ['wrapper_statistic'] });
    this.dailyWrapper = createNode({ tag: 'div', classes: ['wrapper_daily-stat'] });
    this.firstDayWrapper = createNode({ tag: 'div', classes: ['wrapper_first-day-stat'] });
  }

  public async drawDailyStat() {
    this.mainWrapper.innerHTML = '';
    const data: [string, DailyStatObj][] = await this.getStatData() as [string, DailyStatObj][];
    const dayUi = new DayStatUI(data.shift() as [string, DailyStatObj]);
    const dailyCard = dayUi.drawFirstDayStat();
    this.firstDayWrapper.append(dailyCard);
    this.mainWrapper.append(this.firstDayWrapper);
    console.log(this.firstDayWrapper);
    if (data.length > 1) {
      data.forEach((date) => {
        const day = new DayStatUI(date);
        const card = day.drawFirstDayStat();
        this.dailyWrapper.append(card);
      });
      this.mainWrapper.append(this.dailyWrapper);
    }
    return this.mainWrapper;
  }

  private async getStatData() {
    const { userId, token } = this.storage.getUserIdData();
    let dailyStat: [string, DailyStatObj][] = [];
    const statData: StatisticResponse = await this.api.getStatistic({
      token, userId,
    }) as StatisticResponse;
    if (statData) {
      dailyStat = makeDailyStat(statData);
      return dailyStat;
    } dailyStat = [];
    return dailyStat;
  }
}
