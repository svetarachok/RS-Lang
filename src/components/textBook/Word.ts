import { UserAggregatedWord, Word } from '../types/interfaces';
import createNode from '../utils/createNode';
import { BASE_LINK } from '../utils/constants';
import { soundIcon } from './soundSVG';
import { WordController } from '../WordController/WordController';
import { storage } from '../Storage/Storage';
import { checkPageAllDone } from '../utils/checkPageAllDone';
import { checkEmptyUserBook } from '../utils/checkEmptyUserBook';

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

  storage: typeof storage;

  wordAudio: HTMLAudioElement | undefined;

  audioPointer: number;

  words: WordUI[];

  constructor(obj: Word | UserAggregatedWord, TBWords: WordUI[]) {
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
      tag: 'button', classes: ['btn-add', 'btn-secondary'], atributesAdnValues: [['style', 'display: none']], inner: '<span class="material-icons-round btn-icon">menu_book</span><span class="tooltip-add-btn">В сложные</span>',
    }) as HTMLButtonElement;
    this.learnWordBtn = createNode({
      tag: 'button', classes: ['btn-learn', 'btn-secondary'], atributesAdnValues: [['style', 'display: none']], inner: '<span class="material-icons-round btn-icon">spellcheck</span><span class="tooltip-learn-btn">Изучено</span>',
    }) as HTMLButtonElement;
    this.correct = createNode({ tag: 'span', classes: ['correct-answers'], inner: '0' }) as HTMLSpanElement;
    this.incorrect = createNode({ tag: 'span', classes: ['incorrect-answers'], inner: '0' }) as HTMLSpanElement;
    this.transcription = createNode({ tag: 'p', classes: ['word-transcription'], inner: `${this.obj.transcription}` }) as HTMLParagraphElement;
    this.translate = createNode({ tag: 'p', classes: ['word-translate'], inner: `${this.obj.wordTranslate}` }) as HTMLParagraphElement;
    this.transcription = createNode({ tag: 'p', classes: ['word-transcription'], inner: `${this.obj.transcription}` }) as HTMLParagraphElement;
    this.playWord();
    this.listenHardWordBtn();
    this.listenLearnBtn();
    this.storage = storage;
    this.audioPointer = 0;
    this.words = TBWords;
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
      const tooltip = this.addToUserWordsBtn.querySelector('.tooltip-add-btn') as HTMLElement;
      console.log(this.addToUserWordsBtn);
      const { group } = this.storage.getData('textBook');
      let difficulty: 'easy' | 'hard';
      if (this.addToUserWordsBtn.classList.contains('hard-word-btn')) {
        this.addToUserWordsBtn.classList.remove('hard-word-btn');
        difficulty = 'easy';
        this.wordController.updateHardWord(difficulty, this.id);
        tooltip.style.display = 'block';
      } else {
        this.addToUserWordsBtn.classList.add('hard-word-btn');
        difficulty = 'hard';
        this.wordController.updateHardWord(difficulty, this.id);
        tooltip.style.display = 'none';
      }
      if (group === 6) {
        this.card.style.display = 'none';
        checkEmptyUserBook();
      } else {
        checkPageAllDone();
      }
    });
  }

  public listenLearnBtn() {
    this.learnWordBtn.addEventListener('click', () => {
      const tooltip = this.learnWordBtn.querySelector('.tooltip-learn-btn') as HTMLElement;
      const { group } = this.storage.getData('textBook');
      let isLearned: boolean;
      if (this.learnWordBtn.classList.contains('learn-word-btn')) {
        this.learnWordBtn.classList.remove('learn-word-btn');
        this.addToUserWordsBtn.disabled = false;
        isLearned = false;
        this.wordController.updateLearnedWord(isLearned, this.id);
        tooltip.style.display = 'block';
      } else {
        this.learnWordBtn.classList.add('learn-word-btn');
        this.addToUserWordsBtn.classList.remove('hard-word-btn');
        this.addToUserWordsBtn.disabled = true;
        isLearned = true;
        this.wordController.updateLearnedWord(isLearned, this.id);
        tooltip.style.display = 'none';
      }
      if (group === 6) {
        this.card.style.display = 'none';
        checkEmptyUserBook();
      } else {
        checkPageAllDone();
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
      this.learnWordBtn.classList.remove('learn-word-btn');
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

  private playNext() {
    this.audioPointer += 1;
    if (this.audioPointer < this.makeSoundURL().length) {
      this.wordAudio = new Audio(this.makeSoundURL()[this.audioPointer]);
      this.wordAudio.addEventListener('ended', this.playNext.bind(this));
      this.wordAudio.play();
    }
  }

  private play() {
    this.audioPointer = 0;
    this.wordAudio = new Audio(this.makeSoundURL()[this.audioPointer]);
    this.wordAudio.addEventListener('ended', this.playNext.bind(this));
    this.wordAudio.play();
  }

  public playWord() {
    this.playBtn.addEventListener('click', () => {
      this.wordAudio?.pause();
      this.words.forEach((word) => word.wordAudio?.pause());
      this.play();
    });
  }
}
