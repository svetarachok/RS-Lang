import { api } from '../Model/api';
import { createHTMLElement, getRandomIntInclusive } from '../utils/functions';
import { Word, RandomPairInSprint, UserAggregatedWord } from '../types/interfaces';
import { BASE_LINK } from '../utils/constants';
import { WordController } from '../WordController/WordController';
import { Storage } from '../Storage/Storage';
import { convertAggregatedWordToWord } from '../utils/convertAggregatedWordToWord';
import { GAME } from '../types/enums';

export class Sprint {
  mode: 'menu' | 'book';

  api: typeof api;

  wordController: WordController;

  storage: Storage;

  currentLevel: string | undefined;

  wordsInGame: Word[];

  currentWord: Word | undefined;

  trueWords: Word[];

  falseWords: Word[];

  isPairTrue: boolean | undefined;

  score: number;

  POINTS_FOR_WORD: number;

  multiplier: number;

  seriesOfCorrect: number;

  bookPage: number;

  bookLevel: number;

  timerSound: HTMLAudioElement | undefined;

  trueAnswerSound: HTMLAudioElement;

  falseAnswerSound: HTMLAudioElement;

  mute: boolean;

  timerInterval: ReturnType<typeof setInterval> | undefined;

  keyListener: (e: KeyboardEvent) => void;

  constructor(mode: 'menu' | 'book') {
    this.mode = mode;
    this.api = api;
    this.wordController = new WordController();
    this.storage = new Storage();
    this.wordsInGame = [];
    this.score = 0;
    this.POINTS_FOR_WORD = 10;
    this.multiplier = 1;
    this.seriesOfCorrect = 0;
    this.trueWords = [];
    this.falseWords = [];
    this.bookPage = 0;
    this.bookLevel = 0;
    this.trueAnswerSound = this.createAnswerSoud(true);
    this.falseAnswerSound = this.createAnswerSoud(false);
    this.mute = false;
    this.keyListener = this.selectAnswerByKey.bind(this);
  }

  public renderGame(): void {
    const body = <HTMLElement>document.querySelector('.body');
    const main = <HTMLElement>document.querySelector('.main');
    const sprint = createHTMLElement('section', ['sprint']);
    body.classList.add('body--sprint');
    main.innerHTML = '';
    const btnClose = createHTMLElement('a', ['sprint__close'], [['href', '/'], ['data-navigo', 'true']]) as HTMLAnchorElement;
    if (this.mode === 'book') {
      btnClose.href = '#/book';
      sprint.append(btnClose);
      this.startGame();
    } else if (this.mode === 'menu') {
      const select = this.renderSelectLevel();
      sprint.append(select, btnClose);
    }
    main.append(sprint);
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
    if (this.mode === 'menu') {
      const select = <HTMLElement>document.querySelector('.sprint__select');
      select.remove();
      await this.getWordsInLevel(this.currentLevel!);
    } else if (this.mode === 'book') {
      if (this.bookLevel < 6) {
        await this.getWordsOnPage(String(this.bookLevel), String(this.bookPage));
      } else {
        this.wordsInGame = await this.getHardWords();
      }
    }
    const sprint = <HTMLElement>document.querySelector('.sprint');
    const ready = createHTMLElement('div', ['sprint__ready']);
    const timerTitle = createHTMLElement('h2', ['timer__title'], undefined, 'Приготовьтесь');
    sprint.append(ready);
    this.renderTimer(ready, 'timer--ready');
    ready.append(timerTitle);
    const randomPair = this.getRandomPair();
    this.startTimer('timer--ready', 3, this.renderGameContol.bind(this, randomPair.word, randomPair.wordTranslate));
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

  public startTimer(className: string, time: number, cb: Function): void {
    let i = 0;
    const finalOffset = 440;
    const step = finalOffset / time;
    const timer = <HTMLElement>document.querySelector(`.${className}`);
    const timeCaption = <HTMLElement>timer.querySelector('.timer__time');
    const circle = <HTMLElement>document.querySelector('.circle_animation');
    const circleStyle = circle.style;

    circleStyle.strokeDashoffset = String(0);
    timeCaption.innerText = String(time);
    this.timerSound = this.createFinishSound();

    this.timerInterval = setInterval(() => {
      timeCaption.innerText = String(time - i);
      if (time - i <= 10) {
        this.timerSound?.play();
      }
      if (i === time) {
        clearInterval(this.timerInterval);
        this.timerSound?.pause();
        cb();
      } else {
        i += 1;
        circleStyle.strokeDashoffset = String(step * i);
      }
    }, 1000);
  }

  public renderGameContol(firstWordEn: string, firstWordRu: string): void {
    const sprint = <HTMLElement>document.querySelector('.sprint');
    const ready = <HTMLElement>document.querySelector('.sprint__ready');
    ready.remove();
    this.renderTimer(sprint, 'timer--control');
    this.startTimer('timer--control', 10, this.renderResult.bind(this));
    const sprintControl = createHTMLElement('div', ['sprint__control']);
    const score = createHTMLElement('h2', ['control__score'], undefined, '0');
    const sound = createHTMLElement('div', ['control__sound']);
    sound.addEventListener('click', (e) => this.toggleMute(e));
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
    sprint.append(sprintControl);
    buttonFalse.addEventListener('click', (e) => this.selectAnswer(e));
    buttonTrue.addEventListener('click', (e) => this.selectAnswer(e));
    this.addKeyboardControl();
  }

  private async getWordsInLevel(level: string): Promise<void> {
    this.wordsInGame.length = 0;
    const pages = [];
    for (let i = 0; i <= 29; i += 1) {
      const wordsOnPage = api.getWords({ group: level, page: String(i) });
      pages.push(wordsOnPage);
    }
    await Promise.all(pages)
      .then((data) => data.forEach(((page) => this.wordsInGame.push(...page))));
  }

  private async getFilteredWords(level: string, page: string): Promise<Word[]> {
    const userData = this.storage.getUserIdData();
    const userWordsAggr = await this.api.getAggregatedUserWords(
      userData,
      { group: level, page, wordsPerPage: '20' },
    ) as UserAggregatedWord[];
    const userFilteredWords = userWordsAggr.filter((word) => !word?.userWord?.optional?.learned);
    const userWords = userFilteredWords.map((word) => convertAggregatedWordToWord(word));
    return userWords;
  }

  private async getWordsOnPage(level: string, page: string): Promise<void> {
    const wordsOnPage = await api.getWords({ group: level, page });
    if (!this.wordController.isAuthorized) {
      this.wordsInGame = wordsOnPage;
    } else {
      this.wordsInGame = await this.getFilteredWords(level, page);
    }
  }

  private getRandomWord(): Word {
    const maxIndex = this.wordsInGame.length - 1;
    const randomWordIndex = getRandomIntInclusive(0, maxIndex);
    const randomWord = this.wordsInGame[randomWordIndex];
    return randomWord;
  }

  private getRandomPair(): RandomPairInSprint {
    this.currentWord = this.getRandomWord();
    const currentId = this.wordsInGame.indexOf(this.currentWord);
    this.wordsInGame.splice(currentId, 1);
    const randomPair: RandomPairInSprint = { word: this.currentWord.word, wordTranslate: '' };
    const isTrue = Math.random() < 0.5;
    if (this.wordsInGame.length > 0) {
      if (isTrue) {
        this.isPairTrue = true;
        randomPair.wordTranslate = this.currentWord.wordTranslate;
      } else {
        this.isPairTrue = false;
        randomPair.wordTranslate = this.getRandomWord().wordTranslate;
      }
    } else if (this.wordsInGame.length === 0) {
      this.isPairTrue = true;
      randomPair.wordTranslate = this.currentWord.wordTranslate;
    }
    return randomPair;
  }

  private async addWordsInGame(): Promise<void> {
    const prevWords = [];
    if (!this.wordController.isAuthorized) {
      for (let i = this.bookPage; i > 0; i -= 1) {
        prevWords.push(this.api.getWords({ group: String(this.bookLevel), page: String(i - 1) }));
      }
      await Promise.all(prevWords)
        .then((data) => data.forEach(((words) => { this.wordsInGame.push(...words); })));

      if (this.wordsInGame.length === 0) {
        this.finishGame();
      }
    } else if (this.wordController.isAuthorized) {
      for (let i = this.bookPage; i > 0; i -= 1) {
        prevWords.push(this.getFilteredWords(String(this.bookLevel), String(i - 1)));
      }
      await Promise.all(prevWords)
        .then((data) => data.forEach(((words) => { this.wordsInGame.push(...words); })));

      if (this.wordsInGame.length === 0) {
        this.finishGame();
      }
    }
    this.bookPage = 0;
  }

  private async selectAnswer(e: Event): Promise<void> {
    const button = <HTMLElement>e.target;
    const { answer } = button.dataset;
    let isTrue: boolean;
    if (answer === 'true') {
      isTrue = true;
    } else {
      isTrue = false;
    }

    if (isTrue === this.isPairTrue) {
      this.completeTrueAnswer();
    } else {
      this.completeFalseAnswer();
    }

    if (this.wordsInGame.length === 0 && this.mode === 'book' && this.bookLevel < 6) {
      await this.addWordsInGame();
    }

    if (this.wordsInGame.length === 0 && this.mode === 'book' && this.bookLevel === 6) {
      this.finishGame();
    }
    this.updateWord();
  }

  private completeTrueAnswer(): void {
    this.trueWords.push(this.currentWord!);
    this.updateScore();
    this.trueAnswerSound.load();
    this.trueAnswerSound.play();
    this.seriesOfCorrect += 1;
    this.checkSeriesOfCorrect();
    this.changeStyleSeries(this.seriesOfCorrect);
    this.wordController.sendWordOnServer(this.currentWord?.id!, true, GAME.SPRINT);
  }

  private completeFalseAnswer(): void {
    this.falseWords.push(this.currentWord!);
    this.falseAnswerSound.load();
    this.falseAnswerSound.play();
    this.seriesOfCorrect = 0;
    this.multiplier = 1;
    this.changeMultiplyDescr(1);
    this.clearStyleSeries();
    this.clearParrots();
    this.wordController.sendWordOnServer(this.currentWord?.id!, false, GAME.SPRINT);
  }

  private updateWord(): void {
    const word = <HTMLElement>document.querySelector('.control__word-en');
    const translate = <HTMLElement>document.querySelector('.control__word-ru');
    if (this.wordsInGame.length !== 0) {
      const randomPair = this.getRandomPair();
      word.innerHTML = randomPair.word;
      translate.innerHTML = randomPair.wordTranslate;
    }
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

  private createAnswerSoud(value: boolean): HTMLAudioElement {
    const url = `./assets/sprint/sounds/${String(value)}.mp3`;
    return new Audio(url);
  }

  private createFinishSound(): HTMLAudioElement {
    const url = './assets/sprint/sounds/finish_tick.mp3';
    const audio = new Audio(url);
    return audio;
  }

  private renderResult() {
    const sprint = <HTMLElement>document.querySelector('.sprint');
    const control = <HTMLElement>document.querySelector('.sprint__control');
    const timer = <HTMLElement>document.querySelector('.timer--control');
    control.style.display = 'none';
    timer.remove();
    const resultContainer = createHTMLElement('div', ['sprint__result']);
    const score = createHTMLElement('h2', ['result__score'], undefined, `Твой результат: ${this.score} очков`);
    const listsContainer = createHTMLElement('div', ['sprint__lists']);
    const trueList = createHTMLElement('ul', ['result__true'], undefined, `Знаю: ${this.trueWords.length}`);
    const falseList = createHTMLElement('ul', ['result__false'], undefined, `Ошибок: ${this.falseWords.length}`);
    const btnRestart = createHTMLElement('button', ['result__restart-btn'], undefined, 'Играть еще раз');
    btnRestart.addEventListener('click', (e: Event) => {
      const btn = <HTMLButtonElement>e.target;
      if (!btn.disabled) {
        this.restartGame();
        btn.disabled = true;
      }
    });
    this.trueWords.forEach((word) => this.addWordInResult(trueList, word));
    this.falseWords.forEach((word) => this.addWordInResult(falseList, word));
    listsContainer.append(falseList, trueList);
    resultContainer.append(score, listsContainer, btnRestart);
    sprint.append(resultContainer);
  }

  private addWordInResult(list: HTMLElement, word: Word): void {
    const wordEn = createHTMLElement('span', ['result__word-en'], undefined, `${word.word}: `);
    const wordRu = createHTMLElement('span', ['result__word-ru'], undefined, `${word.wordTranslate}`);
    const wordEnRu = createHTMLElement('li', ['result__word']);
    const voice = createHTMLElement('div', ['result__voice']);
    voice.addEventListener('click', () => this.voiceWordInResult(word.audio));
    wordEnRu.append(voice, wordEn, wordRu);
    list.append(wordEnRu);
  }

  private voiceWordInResult(url: string): void {
    const audio = new Audio(`${BASE_LINK}/${url}`);
    audio.play();
  }

  private toggleMute(e: Event) {
    const btn = <HTMLElement>e.target;
    btn.classList.toggle('control__sound--off');
    if (this.mute === false) {
      this.mute = true;
      this.trueAnswerSound.volume = 0;
      this.falseAnswerSound.volume = 0;
    } else if (this.mute === true) {
      this.mute = false;
      this.trueAnswerSound.volume = 1;
      this.falseAnswerSound.volume = 1;
    }
  }

  private finishGame() {
    clearInterval(this.timerInterval);
    this.timerSound?.pause();
    this.renderResult();
    this.removeKeyboardControl();
  }

  public setBookPageAndLevel(level: number, page: number) {
    this.bookPage = page;
    this.bookLevel = level;
  }

  private async selectAnswerByCorrect(correct: boolean) {
    if (correct === this.isPairTrue) {
      this.completeTrueAnswer();
    } else {
      this.completeFalseAnswer();
    }

    if (this.wordsInGame.length === 0 && this.mode === 'book' && this.bookLevel < 6) {
      await this.addWordsInGame();
    }
    this.updateWord();
  }

  private selectAnswerByKey(e: KeyboardEvent) {
    let isTrue: boolean = false;
    if (e.key === 'ArrowRight') {
      isTrue = true;
      this.selectAnswerByCorrect(isTrue);
    } else if (e.key === 'ArrowLeft') {
      isTrue = false;
      this.selectAnswerByCorrect(isTrue);
    }
  }

  private addKeyboardControl(): void {
    document.addEventListener('keydown', this.keyListener);
  }

  private removeKeyboardControl(): void {
    document.removeEventListener('keydown', this.keyListener);
  }

  public closeGame(): void {
    const body = document.querySelector('.body') as HTMLElement;
    body?.classList.remove('body--sprint');
    clearInterval(this.timerInterval);
    this.timerSound?.pause();
    this.removeKeyboardControl();
  }

  private async getHardWords(): Promise<Word[]> {
    const userHardWords = await this.wordController.getUserBookWords() as UserAggregatedWord[];
    if (Array.isArray(userHardWords)) {
      return userHardWords.map((word) => convertAggregatedWordToWord(word));
    }
    return [];
  }

  private async checkWordsAvailability(): Promise<boolean> {
    let words: Word[];
    if (this.bookLevel < 6) {
      words = await api.getWords({ group: String(this.bookLevel), page: String(this.bookPage) });
    } else {
      words = await this.getHardWords();
    }
    if (words.length === 0 || !Array.isArray(words)) {
      const result = <HTMLElement>document.querySelector('.sprint__result');
      const message = createHTMLElement('span', ['sprint__restart-message'], undefined, 'Недостаточно слов для запуска новой игры. Выберите другой уровень или страницу');
      result.append(message);
      return false;
    }
    return true;
  }

  private async restartGame() {
    const isAvailable: boolean = await this.checkWordsAvailability();
    if (isAvailable) {
      this.closeGame();
      this.wordsInGame.length = 0;
      this.score = 0;
      this.multiplier = 1;
      this.seriesOfCorrect = 0;
      this.trueWords.length = 0;
      this.falseWords.length = 0;
      this.renderGame();
    }
  }
}
