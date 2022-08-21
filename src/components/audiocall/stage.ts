import { Word } from '../types/interfaces';
import { BASE_LINK } from '../utils/constants';
import createNode from '../utils/createNode';
import { getRandomWordByGroup } from '../utils/getRandomWords';
import { shuffleArray } from '../utils/shuffleArray';
import { Answer } from './answer';
import { SPEAKER } from './speakerSVG';

const ANSWERS_COUNT = 5;

export class Stage {
  container: HTMLElement;

  word: Word;

  callback: (word: Word, result: boolean) => void;

  wrapper: HTMLElement;

  wordText: HTMLElement;

  answers: Answer[] = [];

  skipButton: HTMLElement;

  nextStageButton: HTMLElement;

  result: boolean = false;

  soundButton: HTMLElement;

  constructor(container: HTMLElement, word: Word, callback: (word: Word, result: boolean) => void) {
    this.container = container;
    this.word = word;
    this.callback = callback;
    this.wrapper = createNode({ tag: 'div', classes: ['stage'] });
    this.wordText = createNode({ tag: 'span', classes: ['word__text'] });
    this.skipButton = createNode({ tag: 'button', classes: ['button', 'button-skip'], inner: 'не знаю' });
    this.nextStageButton = createNode({ tag: 'button', classes: ['button', 'button-next'], inner: '⟶' });
    this.soundButton = createNode({ tag: 'button', classes: ['speaker-button'], inner: SPEAKER });
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
    const wordAnswers = [this.word, ...(await Promise.all(wrongAnswers))];
    const shuffledAnswers = shuffleArray(wordAnswers);
    this.answers = shuffledAnswers.map((word, index) => {
      if (word === this.word) {
        return new Answer(word, index + 1, true, this.answerHandler.bind(this));
      }
      return new Answer(word, index + 1, false, this.answerHandler.bind(this));
    });
  }

  answerHandler(answer: Answer) {
    this.showCorrectAnswer();
    if (answer.isCorrect) this.result = true;
    console.log('result of stage', this.result);
  }

  render() {
    const wordBlock = this.createWordBlock();
    const answersWrapper = createNode({ tag: 'div', classes: ['answers'] });
    const answerButtons = this.answers.map((answer) => answer.div);
    answersWrapper.append(...answerButtons);
    this.skipButton = createNode({ tag: 'button', classes: ['skip-button'], inner: 'не знаю' });
    this.bindSkipButtonEvent(this.skipButton);
    this.wrapper.append(wordBlock, answersWrapper, this.skipButton);
    this.container.append(this.wrapper);
  }

  createWordBlock() {
    const wrapper = createNode({ tag: 'div', classes: ['word'] });
    this.bindSoundButtonEvent(this.soundButton);
    wrapper.append(this.soundButton, this.wordText);
    return wrapper;
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

  bindNextStageButtonEvent(button: HTMLElement) {
    button.addEventListener('click', () => {
      console.log('stage is over');
      this.wrapper.remove();
      this.callback(this.word, this.result);
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
    this.soundButton.classList.add('speaker-button_min');
    this.wrapper.prepend(wordImage);
    this.wordText.innerHTML = this.word.word;
    this.answers.forEach((answer) => answer.removeListener());
    this.bindNextStageButtonEvent(this.nextStageButton);
    this.skipButton.replaceWith(this.nextStageButton);
  }
}