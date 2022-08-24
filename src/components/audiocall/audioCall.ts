import { api } from '../Model/api';
import { GameResult, Word } from '../types/interfaces';
import createNode from '../utils/createNode';
import { getRandomWordsByGroup } from '../utils/getRandomWords';
import { shuffleArray } from '../utils/shuffleArray';
import { LevelSelect } from './levelSelect';
// eslint-disable-next-line import/no-cycle
import { ResultPage } from './resultPage';
import { Stage } from './stage';
import { StartPage } from './startPage';

const COUNT_WORDS_PER_GAME = 10;
const INCORRECT_SERIES = 5;

export class AudioCall {
  private container: HTMLElement;

  private words: Word[] = [];

  private result: GameResult = {
    correct: [],
    incorrect: [],
  };

  private currentStage: number = 0;

  private closeButton: HTMLElement;

  private muteButton: HTMLElement;

  private isMute: boolean = false;

  private settings: { group: string; page: string; } | undefined;

  constructor() {
    this.container = createNode({ tag: 'div', classes: ['audio-call'] });
    this.closeButton = createNode({
      tag: 'a',
      classes: ['close-button'],
      atributesAdnValues: [['href', '/'], ['data-navigo', 'true']],
      inner: 'X',
    });
    this.muteButton = createNode({ tag: 'span', classes: ['material-icons-outlined', 'mute-button'], inner: 'volume_up' });
  }

  public start(settings?: { group: number, page: number }) {
    this.render();
    if (!settings) {
      const levelSelect = new LevelSelect(this.container, this.startGameFromMenu.bind(this));
      levelSelect.render();
    } else {
      this.settings = {
        group: String(settings.group),
        page: String(settings.page),
      };
      const startPage = new StartPage(this.container, this.startGameFromBook.bind(this));
      startPage.render();
    }
  }

  private render() {
    const main = document.querySelector('main') as HTMLElement;
    this.muteButton.addEventListener('click', this.muteButtonHandler);
    this.closeButton.addEventListener('click', this.closeButtonHandler);
    main.innerHTML = '';
    const buttonsWrapper = createNode({ tag: 'div', classes: ['buttons-wrapper'] });
    const wrapper = createNode({ tag: 'div', classes: ['container'] });
    buttonsWrapper.append(this.muteButton, this.closeButton);
    wrapper.append(buttonsWrapper);
    this.container.append(wrapper);
    main.append(this.container);
    // (document.querySelector('footer') as HTMLElement).style.display = 'none';
  }

  private async startGameFromMenu(wordsGroup: string) {
    this.words = await getRandomWordsByGroup(wordsGroup, COUNT_WORDS_PER_GAME);
    this.startGameStage();
  }

  private async startGameFromBook() {
    if (this.settings) this.words = await this.getWordsForGame(this.settings);
    this.startGameStage();
  }

  private async getWordsForGame(settings: { group: string, page: string }) {
    const wordsOnPage = await api.getWords(settings);
    return shuffleArray(wordsOnPage).slice(0, COUNT_WORDS_PER_GAME);
  }

  private startGameStage() {
    const stage = new Stage(
      this.container,
      this.words[this.currentStage],
      this.stageHandler.bind(this),
      this.playAnswerSound.bind(this),
    );
    stage.start();
  }

  private stageHandler(word: Word, stageResult: boolean) {
    if (stageResult) this.result.correct.push(word);
    else this.result.incorrect.push(word);

    if (this.currentStage < COUNT_WORDS_PER_GAME - 1
      && this.result.incorrect.length < INCORRECT_SERIES) {
      this.currentStage += 1;
      this.startGameStage();
    } else { this.endGameHandler(); }
  }

  private endGameHandler() {
    const resultPage = new ResultPage(this.container, this.result);
    resultPage.start();
  }

  private muteButtonHandler = () => {
    this.muteButton.innerHTML = this.isMute ? 'volume_up' : 'volume_off';
    this.isMute = !this.isMute;
  };

  private playAnswerSound(isCorrect: boolean) {
    if (this.isMute) return;
    const audio = new Audio(`./assets/audiocall/sounds/${isCorrect}.mp3`);
    audio.addEventListener('canplaythrough', audio.play);
  }

  private closeButtonHandler = () => {
    this.container.remove();
  };
}
