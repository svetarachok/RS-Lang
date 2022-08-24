import { GameResult, Word } from '../types/interfaces';
import { BASE_LINK } from '../utils/constants';
import createNode from '../utils/createNode';
// eslint-disable-next-line import/no-cycle
import { AudioCall } from './audioCall';

export class ResultPage {
  private container: HTMLElement;

  private result: GameResult;

  private wrapper: HTMLElement;

  private button: HTMLElement;

  constructor(container: HTMLElement, result: GameResult) {
    this.container = container;
    this.result = result;
    this.wrapper = createNode({ tag: 'div', classes: ['game__result'] });
    this.button = createNode({ tag: 'button', classes: ['result__button'], inner: 'сыграть еще раз' });
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
    if (this.result.correct.length === 10) return 'Блестяще!';
    if (this.result.correct.length > 8) return 'Отличный результат!';
    if (this.result.correct.length > 6) return 'Хороший результат!';
    if (this.result.correct.length > 5) return 'Неплохо!';
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
    const game = new AudioCall();
    game.start();
  };
}
