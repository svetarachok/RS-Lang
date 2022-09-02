import { Word } from '../types/interfaces';
import { BASE_LINK } from '../utils/constants';
import createNode from '../utils/createNode';
import { getRandomWordByGroup } from '../utils/getRandomWords';
import { shuffleArray } from '../utils/shuffleArray';
import { Answer } from './answer';
import { SPEAKER } from './speakerSVG';

const ANSWERS_COUNT = 5;

export class Stage {
  private container: HTMLElement;

  private word: Word;

  private callback: (word: Word, result: boolean) => void;

  private wrapper: HTMLElement;

  private wordText: HTMLElement;

  private answers: Answer[] = [];

  private skipButton: HTMLElement;

  private nextStageButton: HTMLElement;

  private result: boolean = false;

  private soundButton: HTMLElement;

  private hasAnswer: boolean = false;

  private playAnswerSound: (isCorrect: boolean) => void;

  private links: NodeListOf<HTMLAnchorElement>;

  constructor(
    container: HTMLElement,
    word: Word,
    callback: (word: Word, result: boolean) => void,
    playAnswerSound: (isCorrect: boolean) => void,
  ) {
    this.container = container;
    this.word = word;
    this.callback = callback;
    this.playAnswerSound = playAnswerSound;
    this.wrapper = createNode({ tag: 'div', classes: ['stage'] });
    this.wordText = createNode({ tag: 'span', classes: ['word__text'] });
    this.skipButton = createNode({ tag: 'button', classes: ['button', 'button-skip'], inner: 'не знаю' });
    this.nextStageButton = createNode({ tag: 'button', classes: ['button', 'button-next'], inner: '⟶' });
    this.soundButton = createNode({ tag: 'button', classes: ['speaker-button'], inner: SPEAKER });
    this.links = document.querySelectorAll('a');
  }

  public async start() {
    await this.setAnswers();
    this.sayWord();
    this.render();
    document.addEventListener('keydown', this.keyHandler);
    this.links.forEach((link) => link.addEventListener('click', () => {
      if (link.href.includes('/audiocall')) {
        this.removeListeners();
        this.container.remove();
      }
    }));
  }

  private async setAnswers() {
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

  private answerHandler(answer?: Answer) {
    this.hasAnswer = true;
    if (answer?.isCorrect) this.result = true;
    this.showCorrectAnswer();
    console.log('result of stage', this.result);
  }

  private render() {
    const wordBlock = this.createWordBlock();
    const answersWrapper = createNode({ tag: 'div', classes: ['answers'] });
    const answerButtons = this.answers.map((answer) => answer.div);
    answersWrapper.append(...answerButtons);
    this.skipButton = createNode({ tag: 'button', classes: ['skip-button'], inner: 'не знаю' });
    this.bindSkipButtonEvent(this.skipButton);
    this.wrapper.append(wordBlock, answersWrapper, this.skipButton);
    this.container.append(this.wrapper);
  }

  private createWordBlock() {
    const wrapper = createNode({ tag: 'div', classes: ['word'] });
    this.bindSoundButtonEvent(this.soundButton);
    wrapper.append(this.soundButton, this.wordText);
    return wrapper;
  }

  private bindSoundButtonEvent(button: HTMLElement) {
    button.addEventListener('click', this.sayWord);
  }

  private bindSkipButtonEvent(button: HTMLElement) {
    button.addEventListener('click', () => {
      console.log('skip pressed');
      this.skipQuestion();
    });
  }

  private bindNextStageButtonEvent(button: HTMLElement) {
    button.addEventListener('click', this.loadNextStage);
  }

  private loadNextStage = () => {
    document.removeEventListener('keydown', this.keyHandler);
    this.wrapper.remove();
    this.callback(this.word, this.result);
  };

  private sayWord = () => {
    const audio = new Audio(`${BASE_LINK}/${this.word.audio}`);
    audio.addEventListener('canplaythrough', audio.play);
  };

  private skipQuestion() {
    this.showCorrectAnswer();
  }

  private showCorrectAnswer() {
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
    this.playAnswerSound(this.result);
  }

  private keyHandler = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      this.sayWord();
      return;
    }
    if (e.key === 'Enter') {
      if (!this.hasAnswer) this.answerHandler();
      else this.loadNextStage();
      return;
    }
    if (this.hasAnswer) return;
    const answerNumber = Number(e.key);
    if (answerNumber > 0 && answerNumber <= this.answers.length) {
      const currentAnswer = this.answers.find((answer) => answer.number === answerNumber);
      if (currentAnswer) {
        this.answerHandler(currentAnswer);
        this.answers.forEach((answer) => answer.addEndStageStyleByKeyboard(currentAnswer));
      }
    }
  };

  private removeListeners = () => {
    document.removeEventListener('keydown', this.keyHandler);
    this.links.forEach((link) => link.removeEventListener('click', this.removeListeners));
  };
}
