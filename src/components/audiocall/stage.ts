import { Word } from '../types/interfaces';
import { BASE_LINK } from '../utils/constants';
// import { BASE_LINK } from '../utils/constants';
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

  wordText: HTMLElement;

  constructor(container: HTMLElement, word: Word) {
    this.container = container;
    this.word = word;
    this.wrapper = createNode({ tag: 'div', classes: ['stage'] });
    this.answers = [word];
    this.wordText = createNode({ tag: 'span', classes: ['word__text'] });
  }

  async start() {
    await this.setAnswers();
    this.playAudio();
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
    const wordBlock = this.createWordBlock();
    const answersWrapper = createNode({ tag: 'div', classes: ['answers'] });
    const answerButtons = this.answers.map((word, index) => this.createAnswerNode(word, index + 1));
    answersWrapper.append(...answerButtons);
    const skipButton = createNode({ tag: 'button', classes: ['skip-button'], inner: 'не знаю' });
    this.bindSkipButtonEvent(skipButton);
    this.wrapper.append(wordBlock, answersWrapper, skipButton);
    this.container.append(this.wrapper);
  }

  createWordBlock() {
    const wrapper = createNode({ tag: 'div', classes: ['word'] });
    const soundButton = createNode({ tag: 'button', classes: ['speaker-button'], inner: SPEAKER });
    this.bindSoundButtonEvent(soundButton);
    wrapper.append(soundButton, this.wordText);
    return wrapper;
  }

  createAnswerNode(word: Word, index: number) {
    const wrapper = createNode({ tag: 'div', classes: ['answer'], atributesAdnValues: [['data-id', word.id]] });
    const answerNumber = createNode({ tag: 'span', classes: ['answer__number'], inner: String(index) });
    const answerText = createNode({ tag: 'span', classes: ['answer__text'], inner: word.wordTranslate });
    wrapper.append(answerNumber, answerText);
    this.bindAnswerButtonEvent(wrapper);
    return wrapper;
  }

  bindAnswerButtonEvent(button: HTMLElement) {
    button.addEventListener('click', () => {
      if (button.dataset.id === this.word.id) {
        console.log('you are right!');
      } else {
        console.log('you are stupid!');
      }
    });
  }

  bindSoundButtonEvent(button: HTMLElement) {
    button.addEventListener('click', this.playAudio);
  }

  bindSkipButtonEvent(button: HTMLElement) {
    button.addEventListener('click', () => {
      console.log('skip pressed');
      this.skipQuestion();
    });
  }

  playAudio = () => {
    const audio = new Audio(`${BASE_LINK}/${this.word.audio}`);
    audio.addEventListener('canplaythrough', audio.play);
  };

  skipQuestion() {
    this.showCorrectAnswer();
  }

  showCorrectAnswer() {
    const wordImage = createNode({
      tag: 'img',
      classes: ['stage__img'],
      atributesAdnValues: [['src', `${BASE_LINK}/${this.word.image}`], ['alt', this.word.word]],
    });
    this.wrapper.prepend(wordImage);
    this.wordText.innerHTML = this.word.word;
  }
}
