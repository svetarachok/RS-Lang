import { api } from '../Model/api';
import { createHTMLElement, getRandomIntInclusive } from '../utils/functions';
import { Word, RandomPairInSprint } from '../types/interfaces';
import { BASE_LINK } from '../utils/constants';

export class Sprint {
  api: typeof api;

  currentLevel: string | undefined;

  wordsInLevel: Word[];

  wordsInGame: Word[];

  currentWord: Word | undefined;

  isPairTrue: boolean | undefined;

  countTrue: number;

  countFalse: number;

  score: number;

  POINTS_FOR_WORD: number;

  multiplier: number;

  seriesOfCorrect: number;

  constructor() {
    this.api = api;
    this.wordsInLevel = [];
    this.wordsInGame = [];
    this.countTrue = 0;
    this.countFalse = 0;
    this.score = 0;
    this.POINTS_FOR_WORD = 10;
    this.multiplier = 1;
    this.seriesOfCorrect = 0;
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
      level.addEventListener('click', (e: Event) => {
        const target = <HTMLElement>e.target;
        const levelNumber = target.dataset.level;
        this.currentLevel = levelNumber;
        this.startGame();
      });
      levels.append(level);
    }
    select.append(selectTitle, levels);
    return select;
  }

  private async startGame(): Promise<void> {
    const select = <HTMLElement>document.querySelector('.sprint__select');
    if (select) {
      select.remove();
    }
    const main = <HTMLElement>document.querySelector('.main');
    const ready = createHTMLElement('div', ['sprint__ready']);
    const timerTitle = createHTMLElement('h2', ['timer__title'], undefined, 'Приготовьтесь');
    main.append(ready);
    await this.getWordsInLevel(this.currentLevel!);
    this.renderTimer(ready, 'timer--ready');
    ready.append(timerTitle);
    const randomPair = this.getRandomPair();
    this.startTimer('timer--ready', 3, this.renderGameContol.bind(this, randomPair.word, randomPair.wordTranslate), this.createFinishSound());
  }

  private renderTimer(container: HTMLElement, className: string) {
    const timer = createHTMLElement('div', ['timer', className]);
    timer.innerHTML = `
    <span class="timer__time"></span>
    <svg class="timer__svg" width="160" height="160" xmlns="http://www.w3.org/2000/svg">
      <circle id="circle" class="circle_animation" r="69.85699" cy="81" cx="81" stroke-width="2" stroke="rgb(40, 195, 138)" fill="none"/>
    </svg>
    `;
    container.append(timer);
  }

  public startTimer(className: string, time: number, cb: Function, sound: HTMLAudioElement): void {
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
      if (time - i <= 10) {
        sound.play();
      }
      if (i === time) {
        clearInterval(interval);
        sound.pause();
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
    this.startTimer('timer--control', 60, () => console.log('end'), this.createFinishSound());
    const sprintControl = createHTMLElement('div', ['sprint__control']);
    const score = createHTMLElement('h2', ['control__score'], undefined, '0');
    const sound = createHTMLElement('div', ['control__sound']);
    const controlContainer = createHTMLElement('div', ['control__container']);
    const voice = createHTMLElement('div', ['control__voice']);
    voice.addEventListener('click', this.voiceWord.bind(this));
    const controlSeriesList = createHTMLElement('div', ['control__series-list']);
    for (let i = 1; i <= 3; i += 1) {
      const controlSeries = createHTMLElement('div', ['control__series'], [['data-series', `${i}`]]);
      controlSeriesList.append(controlSeries);
    }
    const multiply = createHTMLElement('span', ['control__multiply'], undefined, '+10 очков за слово');
    const parrots = createHTMLElement('div', ['control__parrots']);
    const blueParrot = createHTMLElement('img', ['control__parrot'], [['src', './assets/sprint/bird-blue.svg'], ['alt', 'blue parrot']]);
    const wordEn = createHTMLElement('span', ['control__word-en'], undefined, firstWordEn);
    const wordRu = createHTMLElement('span', ['control__word-ru'], undefined, firstWordRu);
    const buttons = createHTMLElement('div', ['control__buttons']);
    const buttonFalse = createHTMLElement('button', ['control__button', 'control__button--false'], [['data-answer', 'false']], 'Неверно');
    const buttonTrue = createHTMLElement('button', ['control__button', 'control__button--true'], [['data-answer', 'true']], 'Верно');
    buttons.append(buttonFalse, buttonTrue);
    parrots.append(blueParrot);
    controlContainer.append(controlSeriesList, multiply, voice, parrots, wordEn, wordRu, buttons);
    sprintControl.append(score, sound, controlContainer);
    main.append(sprintControl);
    buttonFalse.addEventListener('click', (e) => this.selectAnswer(e));
    buttonTrue.addEventListener('click', (e) => this.selectAnswer(e));
  }

  private async getWordsInLevel(level: string): Promise<void> {
    this.wordsInLevel.length = 0;
    const pages = [];
    for (let i = 0; i <= 29; i += 1) {
      const wordsInPage = api.getWords({ group: level, page: String(i) });
      pages.push(wordsInPage);
    }
    await Promise.all(pages)
      .then((data) => data.forEach(((page) => this.wordsInLevel.push(...page))));
  }

  private getRandomWord(): Word {
    const maxIndex = this.wordsInLevel.length - 1;
    const randomWordIndex = getRandomIntInclusive(0, maxIndex);
    const randomWord = this.wordsInLevel[randomWordIndex];
    return randomWord;
  }

  private getRandomPair(): RandomPairInSprint {
    this.currentWord = this.getRandomWord();
    const randomPair: RandomPairInSprint = { word: this.currentWord.word, wordTranslate: '' };
    this.wordsInGame.push(this.currentWord);
    const isTrue = Math.random() < 0.5;
    if (isTrue) {
      this.isPairTrue = true;
      randomPair.wordTranslate = this.currentWord.wordTranslate;
    } else {
      this.isPairTrue = false;
      randomPair.wordTranslate = this.getRandomWord().wordTranslate;
    }
    return randomPair;
  }

  private selectAnswer(e: Event): void {
    const button = <HTMLElement>e.target;
    const { answer } = button.dataset;
    let isTrue: boolean;
    if (answer === 'true') {
      isTrue = true;
    } else {
      isTrue = false;
    }

    if (isTrue === this.isPairTrue) {
      this.palayAnswerSoud(true);
      this.countTrue += 1;
      this.seriesOfCorrect += 1;
      this.checkSeriesOfCorrect();
      this.updateScore();
      this.changeStyleSeries(this.seriesOfCorrect);
    } else {
      this.palayAnswerSoud(false);
      this.countFalse += 1;
      this.seriesOfCorrect = 0;
      this.multiplier = 1;
      this.changeMultiplyDescr(1);
      this.clearStyleSeries();
      this.clearParrots();
    }

    this.updateWord();
  }

  private updateWord(): void {
    const word = <HTMLElement>document.querySelector('.control__word-en');
    const translate = <HTMLElement>document.querySelector('.control__word-ru');
    const randomPair = this.getRandomPair();
    word.innerHTML = randomPair.word;
    translate.innerHTML = randomPair.wordTranslate;
  }

  private updateScore(): void {
    const score = <HTMLElement>document.querySelector('.control__score');
    this.score += this.POINTS_FOR_WORD * this.multiplier;
    score.innerHTML = String(this.score);
  }

  private checkSeriesOfCorrect(): void {
    if (this.seriesOfCorrect === 4) {
      this.changeMultiplyDescr(2);
      this.clearStyleSeries();
      this.addParrot();
    } else if (this.seriesOfCorrect === 5) {
      this.multiplier *= 2;
      this.seriesOfCorrect = 1;
    }
  }

  private changeMultiplyDescr(multiply: number): void {
    const multiplyDescr = <HTMLElement>document.querySelector('.control__multiply');
    multiplyDescr.innerHTML = `+${this.POINTS_FOR_WORD * this.multiplier * multiply} очков за слово`;
  }

  private changeStyleSeries(item: number): void {
    if (item > 0 && item < 4) {
      const series = <HTMLElement>document.querySelector(`[data-series="${item}"]`);
      series.classList.add('control__series--active');
    }
  }

  private clearStyleSeries(): void {
    const seriesAll = <NodeListOf<HTMLElement>>document.querySelectorAll('.control__series');
    seriesAll.forEach((series) => series.classList.remove('control__series--active'));
  }

  private addParrot(): void {
    const parrotsContainer = <HTMLElement>document.querySelector('.control__parrots');
    if (this.multiplier === 1) {
      const redParrot = createHTMLElement('img', ['control__parrot'], [['src', './assets/sprint/bird-red.svg'], ['alt', 'red parrot']]);
      parrotsContainer.append(redParrot);
    } else if (this.multiplier === 2) {
      const purpleParrot = createHTMLElement('img', ['control__parrot'], [['src', './assets/sprint/bird-purple.svg'], ['alt', 'purple parrot']]);
      parrotsContainer.append(purpleParrot);
    } else if (this.multiplier === 4) {
      const yellowParrot = createHTMLElement('img', ['control__parrot'], [['src', './assets/sprint/bird-yellow.svg'], ['alt', 'yellow parrot']]);
      parrotsContainer.append(yellowParrot);
    }
  }

  private clearParrots(): void {
    const parrots = <NodeListOf<HTMLElement>>document.querySelectorAll('.control__parrot');
    const count = parrots.length;
    for (let i = 1; i < count; i += 1) {
      parrots[i].remove();
    }
  }

  private voiceWord(): void {
    const url = `${BASE_LINK}/${this.currentWord?.audio}`;
    const audio = new Audio(url);
    audio.play();
  }

  private palayAnswerSoud(value: boolean): void {
    const url = `./assets/sprint/sounds/${String(value)}.mp3`;
    const audio = new Audio(url);
    audio.play();
  }

  private createFinishSound(): HTMLAudioElement {
    const url = './assets/sprint/sounds/finish_tick.mp3';
    const audio = new Audio(url);
    return audio;
  }
}
