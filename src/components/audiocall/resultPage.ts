import { GameResult, Word } from '../types/interfaces';
import { BASE_LINK } from '../utils/constants';
import createNode from '../utils/createNode';
import { AudioCall } from './audioCall';

export class ResultPage {
  private container: HTMLElement;

  private result: GameResult;

  private wrapper: HTMLElement;

  private button: HTMLElement;

  private links: NodeListOf<HTMLAnchorElement>;

  private nextGameSettings: { group: string; page: string; } | undefined;

  constructor(
    container: HTMLElement,
    result: GameResult,
    nextGameSettings?: { group: string; page: string },
  ) {
    this.container = container;
    this.result = result;
    this.nextGameSettings = nextGameSettings;
    this.wrapper = createNode({ tag: 'div', classes: ['game__result'] });
    this.button = createNode({ tag: 'button', classes: ['result__button'], inner: 'сыграть еще раз' });
    this.links = document.querySelectorAll('a');
  }

  public start() {
    this.render();
  }

  private render() {
    const title = createNode({ tag: 'h2', classes: ['result__score'], inner: this.getTitleText() });
    const listsContainer = createNode({ tag: 'div', classes: ['game__lists'] });
    const trueList = createNode({ tag: 'ul', classes: ['result__true'], inner: `Знаю: ${this.result.correct.length}` });
    const falseList = createNode({ tag: 'ul', classes: ['result__false'], inner: `Не знаю: ${this.result.incorrect.length}` });
    const trueLi = this.result.correct.map((word) => this.createResultLi(word));
    const falseLi = this.result.incorrect.map((word) => this.createResultLi(word));
    this.button.addEventListener('click', this.startNewGame);
    document.addEventListener('keydown', this.keyHandler);
    window.addEventListener('popstate', this.removeListeners);
    this.links.forEach((link) => link.addEventListener('click', () => {
      if (!link.href.includes('/audiocall')) {
        this.removeListeners();
        this.container.remove();
      }
    }));

    trueList.append(...trueLi);
    falseList.append(...falseLi);
    listsContainer.append(trueList, falseList);
    this.wrapper.append(title, listsContainer, this.button);
    this.container.append(this.wrapper);
  }

  private createResultLi(word: Word) {
    const wordEn = createNode({ tag: 'span', classes: ['result__word-en'], inner: `${word.word}: ` });
    const wordRu = createNode({ tag: 'span', classes: ['result__word-ru'], inner: `${word.wordTranslate}` });
    const wordEnRu = createNode({ tag: 'li', classes: ['result__word'] });
    const voice = createNode({ tag: 'div', classes: ['result__voice'] });
    this.voiceHandler(voice, word);
    wordEnRu.append(voice, wordEn, wordRu);
    return wordEnRu;
  }

  private getTitleText() {
    const wordsCount = this.result.correct.length + this.result.incorrect.length;
    const percentOfCorrectAnswers = (this.result.correct.length / wordsCount) * 100;
    if (percentOfCorrectAnswers === 100) return 'Блестяще!';
    if (percentOfCorrectAnswers > 85) return 'Отличный результат!';
    if (percentOfCorrectAnswers > 65) return 'Хороший результат!';
    if (percentOfCorrectAnswers > 55) return 'Неплохо!';
    return 'В другой раз получится лучше!';
  }

  private voiceHandler(element: HTMLElement, word: Word) {
    element.addEventListener('click', () => {
      const audio = new Audio(`${BASE_LINK}/${word.audio}`);
      audio.play();
    });
  }

  private startNewGame = () => {
    this.container.remove();
    document.removeEventListener('keydown', this.keyHandler);
    const game = new AudioCall();
    if (this.nextGameSettings) {
      game.start({
        group: Number(this.nextGameSettings.group), page: Number(this.nextGameSettings.page),
      });
      return;
    }
    game.start();
  };

  private removeListeners = () => {
    document.removeEventListener('keydown', this.keyHandler);
    window.removeEventListener('popstate', this.removeListeners);
    this.links.forEach((link) => link.removeEventListener('click', this.removeListeners));
  };

  private keyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Enter') this.startNewGame();
  };
}
