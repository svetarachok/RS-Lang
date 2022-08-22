import { Word } from '../types/interfaces';
import createNode from '../utils/createNode';
import { BASE_LINK } from '../utils/constants';
import { soundIcon } from './soundSVG';

export class WordUI {
  id: string;

  card: HTMLDivElement;

  playBtn: HTMLButtonElement;

  obj: Word;

  img: HTMLImageElement;

  word: HTMLParagraphElement;

  transcription: HTMLParagraphElement;

  translate: HTMLParagraphElement;

  addToUserWordsBtn: HTMLButtonElement;

  learnWordBtn: HTMLButtonElement;

  constructor(obj: Word) {
    this.obj = obj;
    this.id = obj.id;
    this.card = createNode({ tag: 'div', classes: ['card'] }) as HTMLDivElement;
    this.img = createNode({ tag: 'div', classes: ['card-img'] }) as HTMLImageElement;
    this.playBtn = createNode({ tag: 'button', classes: ['btn', 'btn-play'] }) as HTMLButtonElement;
    this.word = createNode({ tag: 'p', classes: ['word'], inner: `${this.obj.word}` }) as HTMLParagraphElement;
    this.addToUserWordsBtn = createNode({ tag: 'button', classes: ['btn', 'btn-add'] }) as HTMLButtonElement;
    this.learnWordBtn = createNode({ tag: 'button', classes: ['btn', 'btn-learn'] }) as HTMLButtonElement;
    this.transcription = createNode({ tag: 'p', classes: ['word-transcription'], inner: `${this.obj.transcription}` }) as HTMLParagraphElement;
    this.translate = createNode({ tag: 'p', classes: ['word-translate'], inner: `${this.obj.wordTranslate}` }) as HTMLParagraphElement;
    this.transcription = createNode({ tag: 'p', classes: ['word-transcription'], inner: `${this.obj.transcription}` }) as HTMLParagraphElement;
    this.playWord();
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
    userBtns.append(this.addToUserWordsBtn, this.learnWordBtn);
    cardMainInfoWrapper.append(this.img, this.playBtn, cardWordInfo, userBtns);
    this.card.append(cardMainInfoWrapper, wordExamplesWrapper);
    return this.card;
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
    });
  }
}
