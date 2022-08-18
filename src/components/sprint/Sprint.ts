import Api from '../Model/api';
import { createHTMLElement } from '../utils/functions';

export class Sprint {
  api: Api;

  constructor() {
    this.api = new Api();
  }

  public penderGame(): void {
    const body = <HTMLBodyElement>document.querySelector('.body');
    const header = <HTMLElement>document.querySelector('.header');
    const main = <HTMLElement>document.querySelector('.main');
    const footer = <HTMLElement>document.querySelector('.footer');
    body.classList.add('body--sprint');
    main.classList.add('main--sprint');
    header.style.display = 'none';
    footer.style.display = 'none';
    const btnClose = createHTMLElement('a', ['sprint__close'], [['href', '/']]);
    const select = this.renderSelectLevel();
    main.append(select, btnClose);
  }

  private renderSelectLevel(): HTMLElement {
    const select = createHTMLElement('div', ['sprint__select']);
    const selectTitle = createHTMLElement('h2', ['sprint__select-title'], undefined, 'Выберите уровень:');
    const levels = createHTMLElement('div', ['sprint__levels']);
    for (let i = 1; i <= 6; i += 1) {
      const level = createHTMLElement('div', ['sprint__level'], [['data-level', `${i}`]], `${i}`);
      level.addEventListener('click', (e: Event) => {
        const target = <HTMLElement>e.target;
        const levelNumber = target.dataset.level;
        this.startGame(Number(levelNumber));
      });
      levels.append(level);
    }
    select.append(selectTitle, levels);
    return select;
  }

  private startGame(level: number): void {
    const select = <HTMLElement>document.querySelector('.sprint__select');
    if (select) {
      select.remove();
    }
    const main = <HTMLElement>document.querySelector('.main');
    const ready = createHTMLElement('div', ['sprint__ready']);
    const timerTitle = createHTMLElement('h2', ['timer__title'], undefined, 'Приготовьтесь');
    main.append(ready);
    this.renderTimer(ready, 'timer--ready');
    ready.append(timerTitle);
    this.startTimer('timer--ready', 2, this.renderGameContol.bind(this));
    console.log(level);
  }

  private renderTimer(container: HTMLElement, className:string) {
    const timer = createHTMLElement('div', ['timer', className]);
    timer.innerHTML = `
    <span class="timer__time">time</span>
    <svg class="timer__svg" width="160" height="160" xmlns="http://www.w3.org/2000/svg">
      <circle id="circle" class="circle_animation" r="69.85699" cy="81" cx="81" stroke-width="2" stroke="rgb(40, 195, 138)" fill="none"/>
    </svg>
    `;
    container.append(timer);
  }

  public startTimer(className:string, time: number, cb: Function) {
    let i = 0;
    const finalOffset = 440;
    const step = finalOffset / time;
    const timeCaption = <HTMLElement>document.querySelector('.timer__time');
    const circle = <HTMLElement>document.querySelector('.circle_animation');
    const circleStyle = circle.style;

    circleStyle.strokeDashoffset = String(0);
    timeCaption.innerText = String(time);

    const interval = setInterval(() => {
      timeCaption.innerText = String(time - i);
      if (i === time) {
        clearInterval(interval);
        cb();
      } else {
        i += 1;
        circleStyle.strokeDashoffset = String(step * i);
      }
    }, 1000);
  }

  public renderGameContol(): void {
    const main = <HTMLElement>document.querySelector('.main');
    const ready = <HTMLElement>document.querySelector('.sprint__ready');
    ready.remove();
    this.renderTimer(main, 'timer--control');
    this.startTimer('timer--control', 60, () => console.log('end'));
  }
}
