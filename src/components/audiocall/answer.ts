import { Word } from '../types/interfaces';
import createNode from '../utils/createNode';

export class Answer {
  private word: Word;

  public number: number;

  public isCorrect: boolean;

  private callback: (answer: Answer) => void;

  public div: HTMLElement;

  private answerNumberSpan: HTMLElement;

  private answerTextSpan: HTMLElement;

  constructor(word: Word, number: number, isCorrect: boolean, callback: (answer: Answer) => void) {
    this.word = word;
    this.number = number;
    this.isCorrect = isCorrect;
    this.callback = callback;
    this.answerNumberSpan = createNode({ tag: 'span', classes: ['answer__number'], inner: String(this.number) });
    this.answerTextSpan = createNode({ tag: 'span', classes: ['answer__text'], inner: this.word.wordTranslate });
    this.div = createNode({ tag: 'div', classes: ['answer'], atributesAdnValues: [['data-id', this.word.id]] });
    this.div.append(this.answerNumberSpan, this.answerTextSpan);
    this.div.addEventListener('click', this.eventHandler);
  }

  private eventHandler = () => {
    this.addEndStageStyleByClick();
    this.callback(this);
  };

  private addTextOpacity() {
    if (this.isCorrect) return;
    this.answerTextSpan.style.opacity = '0.5';
  }

  private addEndStageStyleByClick() {
    if (this.isCorrect) {
      this.answerNumberSpan.innerText = '✔';
      this.answerNumberSpan.classList.add('checked');
    } else {
      this.answerTextSpan.style.textDecoration = 'line-through';
    }
  }

  public addEndStageStyleByKeyboard(answer: Answer) {
    if (answer === this) this.addEndStageStyleByClick();
  }

  public removeListener() {
    this.div.removeEventListener('click', this.eventHandler);
    this.addTextOpacity();
  }
}
