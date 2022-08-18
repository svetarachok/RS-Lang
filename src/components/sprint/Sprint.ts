import Api from '../Model/api';
import { createHTMLElement } from '../utils/functions';

export class Sprint {
  api: Api;

  currentLevel: number | undefined;

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
        this.currentLevel = Number(levelNumber);
        this.startGame();
      });
      levels.append(level);
    }
    select.append(selectTitle, levels);
    return select;
  }

  private startGame(): void {
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
    const sprintControl = createHTMLElement('div', ['sprint__control']);
    const score = createHTMLElement('h2', ['control__score'], undefined, '0');
    const sound = createHTMLElement('div', ['control__sound']);
    const controlContainer = createHTMLElement('div', ['control__container']);
    const voice = createHTMLElement('div', ['control__voice']);
    const controlSeriesList = createHTMLElement('div', ['control__series-list']);
    for (let i = 1; i <= 3; i += 1) {
      const controlSeries = createHTMLElement('div', ['control__series'], [['data-series', `${i}`]]);
      controlSeriesList.append(controlSeries);
    }
    const parrots = createHTMLElement('div', ['control__parrots']);
    const blueParrot = createHTMLElement('img', ['control__parrot'], [['src', './assets/sprint/bird-blue.svg'], ['alt', 'blue parrot']]);
    const wordEn = createHTMLElement('span', ['control__word-en'], undefined, 'hello');
    const wordRu = createHTMLElement('span', ['control__word-ru'], undefined, 'привет');
    const buttons = createHTMLElement('div', ['control__buttons']);
    const buttonFalse = createHTMLElement('button', ['control__button', 'control__button--false'], [['data-answer', 'false']], 'Неверно');
    const buttonTrue = createHTMLElement('button', ['control__button', 'control__button--true'], [['data-answer', 'true']], 'Верно');
    buttons.append(buttonFalse, buttonTrue);
    parrots.append(blueParrot);
    controlContainer.append(controlSeriesList, voice, parrots, wordEn, wordRu, buttons);
    sprintControl.append(score, sound, controlContainer);
    main.append(sprintControl);
  }
}
