import { GameResult, Word } from '../types/interfaces';
import { BASE_LINK } from '../utils/constants';
import createNode from '../utils/createNode';

export class ResultPage {
  container: HTMLElement;

  result: GameResult;

  wrapper: HTMLElement;

  constructor(container: HTMLElement, result: GameResult) {
    this.container = container;
    this.result = result;
    this.wrapper = createNode({ tag: 'div', classes: ['game__result'] });
  }

  start() {
    this.render();
  }

  render() {
    const title = createNode({ tag: 'h2', classes: ['result__score'], inner: this.getTitleText() });
    const listsContainer = createNode({ tag: 'div', classes: ['game__lists'] });
    const trueList = createNode({ tag: 'ul', classes: ['result__true'], inner: `Знаю: ${this.result.correct.length}` });
    const falseList = createNode({ tag: 'ul', classes: ['result__false'], inner: `Не знаю: ${this.result.incorrect.length}` });
    const trueLi = this.result.correct.map((word) => this.createResultLi(word));
    const falseLi = this.result.incorrect.map((word) => this.createResultLi(word));

    trueList.append(...trueLi);
    falseList.append(...falseLi);
    listsContainer.append(trueList, falseList);
    this.wrapper.append(title, listsContainer);
    this.container.append(this.wrapper);
  }

  createResultLi(word: Word) {
    const wordEn = createNode({ tag: 'span', classes: ['result__word-en'], inner: `${word.word}: ` });
    const wordRu = createNode({ tag: 'span', classes: ['result__word-ru'], inner: `${word.wordTranslate}` });
    const wordEnRu = createNode({ tag: 'li', classes: ['result__word'] });
    const voice = createNode({ tag: 'div', classes: ['result__voice'] });
    this.voiceHandler(voice, word);
    wordEnRu.append(voice, wordEn, wordRu);
    return wordEnRu;
  }

  getTitleText() {
    if (this.result.correct.length === 10) return 'Блестяще!';
    if (this.result.correct.length > 8) return 'Отличный результат!';
    if (this.result.correct.length > 6) return 'Хороший результат!';
    if (this.result.correct.length > 5) return 'Неплохо!';
    return 'В другой раз получится лучше!';
  }

  voiceHandler(element: HTMLElement, word: Word) {
    element.addEventListener('click', () => {
      const audio = new Audio(`${BASE_LINK}/${word.audio}`);
      audio.play();
    });
  }
}
