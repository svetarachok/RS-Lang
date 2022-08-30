import { AuthorizationData } from '../types/interfaces';
import { StatisticUI } from '../UserStatistic/StatisticUI';
import { REGISTER_BTN, LOGIN_BTN, USER_AUTH_WRAPPER } from '../utils/constants';
import createNode from '../utils/createNode';
import { Charts } from '../Charts/Charts';

export class UserUI {
  userPage: HTMLElement;

  headerEnterBtn: HTMLButtonElement;

  name: HTMLElement;

  email: HTMLElement;

  exitBtn: HTMLButtonElement;

  statisticPage: HTMLElement;

  statUI: StatisticUI;

  charts: Charts;

  constructor() {
    this.headerEnterBtn = createNode({
      tag: 'a', classes: ['enter-cabinet-link'], atributesAdnValues: [['href', '/user'], ['data-navigo', 'true']], inner: 'Enter Cabinet',
    }) as HTMLButtonElement;
    this.userPage = createNode({ tag: 'div', classes: ['user-page'] });
    this.name = createNode({ tag: 'h2', classes: ['user-name'] });
    this.email = createNode({ tag: 'p', classes: ['user-name'] });
    this.exitBtn = createNode({ tag: 'button', classes: ['btn', 'exit-cabinet-btn'], inner: 'Exit cabinet' }) as HTMLButtonElement;
    this.statisticPage = createNode({ tag: 'div', classes: ['statistic-block'] });
    this.statUI = new StatisticUI();
    this.charts = new Charts();
  }

  public authorise(res: AuthorizationData) {
    this.name.innerHTML = res.name;
    REGISTER_BTN.style.display = 'none';
    LOGIN_BTN.style.display = 'none';
    USER_AUTH_WRAPPER.append(this.headerEnterBtn);
    this.headerEnterBtn.style.display = 'flex';
    return USER_AUTH_WRAPPER;
  }

  public unAuthorize(hanlder: () => void) {
    this.exitBtn.addEventListener('click', () => {
      REGISTER_BTN.style.display = 'block';
      LOGIN_BTN.style.display = 'block';
      this.headerEnterBtn.style.display = 'none';
      hanlder();
    });
  }

  public async renderUserPage() {
    const container: HTMLElement = document.querySelector('.main') as HTMLElement;
    container.innerHTML = '';
    this.userPage.innerHTML = '';
    console.log(this.userPage.innerHTML);
    const userSection = createNode({ tag: 'section', classes: ['user-section'] });
    const chartsSection = createNode({ tag: 'section', classes: ['charts-section'] });
    const dailyStatSection = createNode({ tag: 'section', classes: ['daily-stat-section'] });
    const userBlock = createNode({ tag: 'aside', classes: ['aside', 'user-sidebar'] });
    userBlock.append(this.name, this.email, this.exitBtn);
    const todayStatistic = await this.renderTodayStatisticBlock();
    const dailyStatistic = await this.renderStatisticBlock();
    const charts = this.renderChartsBlock();
    userSection.append(userBlock, todayStatistic);
    chartsSection.append(charts);
    dailyStatSection.append(dailyStatistic);
    this.userPage.append(userSection, chartsSection, dailyStatSection);
    container.append(this.userPage);
    const stat = await this.charts.getStatisticForCarts();
    this.charts.createChart(
      'myChart-1',
      stat.dates,
      stat.newWords,
      'Количество новых',
    );
    this.charts.createChart(
      'myChart-2',
      stat.dates,
      stat.learnedWords,
      'Количество выученных',
    );
    return container;
  }

  public async renderStatisticBlock() {
    this.statisticPage.innerHTML = '';
    const statisticData = await this.statUI.drawDailyStat();
    this.statisticPage.append(statisticData);
    console.log('statistic rendered');
    return this.statisticPage;
  }

  public async renderTodayStatisticBlock() {
    console.log('try do draw today');
    const statisticData = await this.statUI.drawTodayStat();
    return statisticData;
  }

  private renderChartsBlock() {
    const charts = createNode({ tag: 'section', classes: ['charts'] });
    this.renderChartCanvas(charts, 'chart', 'myChart-1');
    this.renderChartCanvas(charts, 'chart', 'myChart-2');
    return charts;
  }

  private renderChartCanvas(container: HTMLElement, className: string, id: string) {
    const chart = createNode({
      tag: 'canvas',
      classes: [className],
      atributesAdnValues: [['id', id]],
    });
    container.append(chart);
  }
}
