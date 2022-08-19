import { api } from '../Model/api';
import { createHTMLElement, getRandomIntInclusive } from '../utils/functions';
import { Word } from '../types/interfaces';

export class Sprint {
  api: typeof api;

  currentLevel: string | undefined;

  wordsInLevel: Word[];

  wordsInGame: Word[];

  isPairTrue: boolean | undefined;

  countTrue: number;

  countFalse: number;

  constructor() {
    this.api = api;
    this.wordsInLevel = [];
    this.wordsInGame = [];
    this.countTrue = 0;
    this.countFalse = 0;
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
      const level = createHTMLElement('div', ['sprint__level'], [['data-level', `${i - 1}`]], `${i}`);
      level.addEventListener('click', async (e: Event) => {
        const target = <HTMLElement>e.target;
        const levelNumber = target.dataset.level;
        this.currentLevel = levelNumber!;
        await this.getWordsInLevel(this.currentLevel);
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
    const randomPair = this.getRandomPair();
    this.startTimer('timer--ready', 3, this.renderGameContol.bind(this, randomPair.word, randomPair.wordTranslate));
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

  public startTimer(className: string, time: number, cb: Function) {
    let i = 0;
    const finalOffset = 440;
    const step = finalOffset / time;
    const timer = <HTMLElement>document.querySelector(`.${className}`);
    const timeCaption = <HTMLElement>timer.querySelector('.timer__time');
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

  public renderGameContol(firstWordEn: string, firstWordRu: string): void {
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
    const wordEn = createHTMLElement('span', ['control__word-en'], undefined, firstWordEn);
    const wordRu = createHTMLElement('span', ['control__word-ru'], undefined, firstWordRu);
    const buttons = createHTMLElement('div', ['control__buttons']);
    const buttonFalse = createHTMLElement('button', ['control__button', 'control__button--false'], [['data-answer', 'false']], 'Неверно');
    const buttonTrue = createHTMLElement('button', ['control__button', 'control__button--true'], [['data-answer', 'true']], 'Верно');
    buttons.append(buttonFalse, buttonTrue);
    parrots.append(blueParrot);
    controlContainer.append(controlSeriesList, voice, parrots, wordEn, wordRu, buttons);
    sprintControl.append(score, sound, controlContainer);
    main.append(sprintControl);
    buttonFalse.addEventListener('click', (e) => this.selectAnswer(e));
    buttonTrue.addEventListener('click', (e) => this.selectAnswer(e));
  }

  private async getWordsInLevel(level: string) {
    this.wordsInLevel.length = 0;
    const pages = [];
    for (let i = 0; i <= 29; i += 1) {
      const wordsInPage = api.getWords({ group: level, page: String(i) });
      pages.push(wordsInPage);
    }
    await Promise.all(pages)
      .then((data) => data.forEach(((page) => this.wordsInLevel.push(...page))));
    console.log(this.wordsInLevel);
  }

  private getRandomWord() {
    const maxIndex = this.wordsInLevel.length - 1;
    const randomWordIndex = getRandomIntInclusive(0, maxIndex);
    const randomWord = this.wordsInLevel[randomWordIndex];
    return randomWord;
  }

  private getRandomPair() {
    const randomWord = this.getRandomWord();
    const randomPair = { word: randomWord.word, wordTranslate: '' };
    this.wordsInGame.push(randomWord);
    const isTrue = Math.random() < 0.5;
    if (isTrue) {
      this.isPairTrue = true;
      randomPair.wordTranslate = randomWord.wordTranslate;
    } else {
      this.isPairTrue = false;
      randomPair.wordTranslate = this.getRandomWord().wordTranslate;
    }
    return randomPair;
  }

  private selectAnswer(e: Event) {
    const button = <HTMLElement>e.target;
    const { answer } = button.dataset;
    let isTrue: boolean;
    if (answer === 'true') {
      isTrue = true;
    } else {
      isTrue = false;
    }

    if (isTrue === this.isPairTrue) {
      this.countTrue += 1;
      console.log(true);
    } else {
      this.countFalse += 1;
      console.log(false);
    }

    this.updateWord();
  }

  private updateWord() {
    const wordInDOM = <HTMLElement>document.querySelector('.control__word-en');
    const translateInDOM = <HTMLElement>document.querySelector('.control__word-ru');
    const randomPair = this.getRandomPair();
    wordInDOM.innerHTML = randomPair.word;
    translateInDOM.innerHTML = randomPair.wordTranslate;
  }
}
