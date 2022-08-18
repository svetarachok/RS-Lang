import { Word } from '../types/interfaces';
import createNode from '../utils/createNode';
import { getRandomWordByGroup } from '../utils/getRandomWords';
import { shuffleArray } from '../utils/shuffleArray';
import { SPEAKER } from './speakerSVG';

const ANSWERS_COUNT = 5;

export class Stage {
  container: HTMLElement;

  word: Word;

  wrapper: HTMLElement;

  answers: Word[];

  constructor(container: HTMLElement, word: Word) {
    this.container = container;
    this.word = word;
    this.wrapper = createNode({ tag: 'div', classes: ['stage'] });
    this.answers = [word];
  }

  async start() {
    await this.setAnswers();
    this.render();
  }

  async setAnswers() {
    const wrongAnswers: Promise<Word>[] = [];
    for (let i = 0; wrongAnswers.length < ANSWERS_COUNT - 1; i += 1) {
      wrongAnswers.push(getRandomWordByGroup(String(this.word.group)));
    }
    this.answers.push(...(await Promise.all(wrongAnswers)));
    this.answers = shuffleArray(this.answers);
  }

  render() {
    const soundButton = createNode({ tag: 'button', classes: ['speaker-button'], inner: SPEAKER });
    const answersWrapper = createNode({ tag: 'div', classes: ['answers'] });
    const answerNodes = this.answers.map((word, index) => this.createAnswerNode(word, index + 1));
    answersWrapper.append(...answerNodes);
    const skipButton = createNode({ tag: 'button', classes: ['skip-button'], inner: 'не знаю' });
    this.wrapper.append(soundButton, answersWrapper, skipButton);
    this.container.append(this.wrapper);
  }

  createAnswerNode(word: Word, index: number) {
    const wrapper = createNode({ tag: 'div', classes: ['answer'] });
    const answerNumber = createNode({ tag: 'span', classes: ['answer__number'], inner: String(index) });
    const answerText = createNode({ tag: 'span', classes: ['answer__text'], inner: word.word });
    wrapper.append(answerNumber, answerText);
    return wrapper;
  }
}
