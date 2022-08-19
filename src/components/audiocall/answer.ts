import { Word } from '../types/interfaces';
import createNode from '../utils/createNode';

export class Answer {
  word: Word;

  number: number;

  isCorrect: boolean;

  callback: (answer: Answer) => void;

  div: HTMLElement;

  answerNumberSpan: HTMLElement;

  answerTextSpan: HTMLElement;

  constructor(word: Word, number: number, isCorrect: boolean, callback: (answer: Answer) => void) {
    this.word = word;
    this.number = number;
    this.isCorrect = isCorrect;
    this.callback = callback;
    this.answerNumberSpan = createNode({ tag: 'span', classes: ['answer__number'], inner: String(this.number) });
    this.answerTextSpan = createNode({ tag: 'span', classes: ['answer__text'], inner: this.word.wordTranslate });
    this.div = createNode({ tag: 'div', classes: ['answer'], atributesAdnValues: [['data-id', this.word.id]] });
    this.div.append(this.answerNumberSpan, this.answerTextSpan);
    this.div.addEventListener('click', () => this.callback(this));
  }
}
