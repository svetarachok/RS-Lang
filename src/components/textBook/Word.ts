import { UserAggregatedWord, Word } from '../types/interfaces';
import createNode from '../utils/createNode';
import { BASE_LINK } from '../utils/constants';
import { soundIcon } from './soundSVG';
import { WordController } from '../WordController/WordController';

export class WordUI {
  id: string;

  card: HTMLDivElement;

  playBtn: HTMLButtonElement;

  obj: Word | UserAggregatedWord;

  img: HTMLImageElement;

  word: HTMLParagraphElement;

  transcription: HTMLParagraphElement;

  translate: HTMLParagraphElement;

  addToUserWordsBtn: HTMLButtonElement;

  learnWordBtn: HTMLButtonElement;

  correct: HTMLSpanElement;

  incorrect: HTMLSpanElement;

  wordController = new WordController();

  constructor(obj: Word | UserAggregatedWord) {
    this.obj = obj;
    if ((obj as Word)?.id) {
      this.id = (obj as Word).id;
    } else {
      // eslint-disable-next-line no-underscore-dangle
      this.id = (obj as UserAggregatedWord)._id;
    }
    this.card = createNode({ tag: 'div', classes: ['card'] }) as HTMLDivElement;
    this.img = createNode({ tag: 'div', classes: ['card-img'] }) as HTMLImageElement;
    this.playBtn = createNode({ tag: 'button', classes: ['btn', 'btn-play'] }) as HTMLButtonElement;
    this.word = createNode({
      tag: 'p', classes: ['word'], inner: `${this.obj.word}`,
    }) as HTMLParagraphElement;
    this.addToUserWordsBtn = createNode({
      tag: 'button', classes: ['btn-add', 'btn-secondary'], atributesAdnValues: [['style', 'display: none']], inner: '<span class="material-icons-outlined btn-icon">menu_book</span>',
    }) as HTMLButtonElement;
    this.learnWordBtn = createNode({
      tag: 'button', classes: ['btn-learn', 'btn-secondary'], atributesAdnValues: [['style', 'display: none']], inner: '<span class="material-icons-outlined btn-icon">spellcheck</span>',
    }) as HTMLButtonElement;
    this.correct = createNode({ tag: 'span', classes: ['correct-answers'], inner: '0' }) as HTMLSpanElement;
    this.incorrect = createNode({ tag: 'span', classes: ['incorrect-answers'], inner: '0' }) as HTMLSpanElement;
    this.transcription = createNode({ tag: 'p', classes: ['word-transcription'], inner: `${this.obj.transcription}` }) as HTMLParagraphElement;
    this.translate = createNode({ tag: 'p', classes: ['word-translate'], inner: `${this.obj.wordTranslate}` }) as HTMLParagraphElement;
    this.transcription = createNode({ tag: 'p', classes: ['word-transcription'], inner: `${this.obj.transcription}` }) as HTMLParagraphElement;
    this.playWord();
    this.listenHardWordBtn();
    this.listenLearnBtn();
  }

  public drawCard(): HTMLDivElement {
    const cardMainInfoWrapper: HTMLDivElement = createNode({ tag: 'div', classes: ['card-main-info-wrapper'] }) as HTMLDivElement;
    const cardWordInfo: HTMLDivElement = createNode({ tag: 'div', classes: ['card-word-info'] }) as HTMLDivElement;
    const userBtns: HTMLDivElement = createNode({ tag: 'div', classes: ['user-btns'] }) as HTMLDivElement;
    const wordExamplesWrapper: HTMLDivElement = createNode({ tag: 'div', classes: ['card-examples-wrapper'] }) as HTMLDivElement;
    const wordMeaning: HTMLParagraphElement = createNode({ tag: 'p', classes: ['word-mean'], inner: `${this.obj.textMeaning}` }) as HTMLParagraphElement;
    const wordMeaningTranslate: HTMLParagraphElement = createNode({ tag: 'p', classes: ['word-mean-translate'], inner: `${this.obj.textMeaningTranslate}` }) as HTMLParagraphElement;
    const wordExample: HTMLParagraphElement = createNode({ tag: 'p', classes: ['word-ex'], inner: `${this.obj.textExample}` }) as HTMLParagraphElement;
    const wordExampleTranslate: HTMLParagraphElement = createNode({ tag: 'p', classes: ['word-ex-translate'], inner: `${this.obj.textExampleTranslate}` }) as HTMLParagraphElement;
    this.playBtn.innerHTML = soundIcon;
    this.img.style.background = `center / cover no-repeat url(${BASE_LINK}/${this.obj.image})`;
    wordExamplesWrapper.append(
      wordMeaning,
      wordMeaningTranslate,
      wordExample,
      wordExampleTranslate,
    );
    cardWordInfo.append(this.word, this.transcription, this.translate);
    cardMainInfoWrapper.append(this.img, this.playBtn, cardWordInfo);
    userBtns.append(this.addToUserWordsBtn, this.learnWordBtn);
    if ((this.obj as UserAggregatedWord).userWord) {
      const answers = createNode({ tag: 'div', classes: ['answers'] });
      answers.append(this.correct, '/', this.incorrect);
      userBtns.append(this.addToUserWordsBtn, this.learnWordBtn, answers);
      this.checkUserWordUpdate(
        (this.obj as UserAggregatedWord).userWord.difficulty,
        (this.obj as UserAggregatedWord).userWord.optional.learned,
      );
      this.correct.innerHTML = String(
        (this.obj as UserAggregatedWord).userWord.optional.correctAnswers,
      );
      this.incorrect.innerHTML = String(
        (this.obj as UserAggregatedWord).userWord.optional.incorrectAnswers,
      );
    }
    cardMainInfoWrapper.append(userBtns);
    this.card.append(cardMainInfoWrapper, wordExamplesWrapper);
    return this.card;
  }

  public listenHardWordBtn() {
    this.addToUserWordsBtn.addEventListener('click', () => {
      let difficulty: 'easy' | 'hard';
      if (this.addToUserWordsBtn.classList.contains('hard-word-btn')) {
        this.addToUserWordsBtn.classList.remove('hard-word-btn');
        difficulty = 'easy';
        this.wordController.updateHardWord(difficulty, this.id);
      } else {
        this.addToUserWordsBtn.classList.add('hard-word-btn');
        difficulty = 'hard';
        this.wordController.updateHardWord(difficulty, this.id);
      }
    });
  }

  public listenLearnBtn() {
    this.learnWordBtn.addEventListener('click', () => {
      let isLearned: boolean;
      if (this.learnWordBtn.classList.contains('learn-word-btn')) {
        this.learnWordBtn.classList.remove('learn-word-btn');
        this.addToUserWordsBtn.disabled = false;
        isLearned = false;
        this.wordController.updateLearnedWord(isLearned, this.id);
      } else {
        this.learnWordBtn.classList.add('learn-word-btn');
        this.addToUserWordsBtn.classList.remove('hard-word-btn');
        this.addToUserWordsBtn.disabled = true;
        isLearned = true;
        this.wordController.updateLearnedWord(isLearned, this.id);
      }
    });
  }

  private async checkUserWordUpdate(difficulty: 'easy' | 'hard', learned: boolean) {
    if (learned === true && !this.learnWordBtn.classList.contains('learn-word-btn')) {
      this.learnWordBtn.classList.add('learn-word-btn');
      this.addToUserWordsBtn.disabled = true;
    }
    if (difficulty === 'hard' && !this.addToUserWordsBtn.classList.contains('hard-word-btn')) {
      this.addToUserWordsBtn.classList.add('hard-word-btn');
      this.addToUserWordsBtn.disabled = false;
    }
  }

  private makeSoundURL(): string[] {
    const wordSoundString: string = this.obj.audio as string;
    const exampleSound = this.obj.audioExample as string;
    const meaningSound = this.obj.audioMeaning as string;
    const arr: string[] = [];
    arr.push(`${BASE_LINK}/${wordSoundString}`, `${BASE_LINK}/${meaningSound}`, `${BASE_LINK}/${exampleSound}`);
    return arr;
  }

  private playNext(audioPointer: number, audioArray: string[]) {
    if (audioPointer < audioArray.length) {
      const audio = new Audio(audioArray[audioPointer]);
      audio.addEventListener('ended', () => this.playNext(audioPointer, audioArray));
      audio.play();
      // eslint-disable-next-line no-param-reassign
      audioPointer += 1;
    }
  }

  private play(arr: string[]) {
    const audioPointer = 0;
    this.playNext(audioPointer, arr);
  }

  public playWord() {
    this.playBtn.addEventListener('click', () => {
      const soundUrl: string[] = this.makeSoundURL();
      this.play(soundUrl);
      console.log(this.id);
    });
  }
}
