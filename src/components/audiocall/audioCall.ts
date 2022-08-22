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

export class AudioCall {
  container: HTMLElement;

  words: Word[] = [];

  result: GameResult = {
    correct: [],
    incorrect: [],
  };

  currentStage: number = 0;

  closeButton: HTMLElement;

  muteButton: HTMLElement;

  isMute: boolean = false;

  settings: { group: string; page: string; } | undefined;

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

  start(settings?: { group: number, page: number }) {
    this.render();
    console.log('start');
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

  render() {
    const main = document.querySelector('main') as HTMLElement;
    this.muteButton.addEventListener('click', this.muteButtonHandler);
    this.closeButton.addEventListener('click', this.closeButtonHandler);
    main.innerHTML = '';
    this.container.append(this.muteButton, this.closeButton);
    main.append(this.container);
    (document.querySelector('footer') as HTMLElement).style.display = 'none';
  }

  async startGameFromMenu(wordsGroup: string) {
    this.words = await getRandomWordsByGroup(wordsGroup, COUNT_WORDS_PER_GAME);
    console.log(this.words);
    this.startGameStage();
  }

  async startGameFromBook() {
    if (this.settings) this.words = await this.getWordsForGame(this.settings);
    console.log(this.words);
    this.startGameStage();
  }

  async getWordsForGame(settings: { group: string, page: string }) {
    const wordsOnPage = await api.getWords(settings);
    return shuffleArray(wordsOnPage).slice(0, COUNT_WORDS_PER_GAME);
  }

  startGameStage() {
    const stage = new Stage(
      this.container,
      this.words[this.currentStage],
      this.stageHandler.bind(this),
      this.playAnswerSound.bind(this),
    );
    stage.start();
  }

  stageHandler(word: Word, stageResult: boolean) {
    if (stageResult) this.result.correct.push(word);
    else this.result.incorrect.push(word);

    if (this.currentStage < COUNT_WORDS_PER_GAME - 1) {
      this.currentStage += 1;
      this.startGameStage();
    } else { this.endGameHandler(); }
  }

  endGameHandler() {
    console.log(this.result);
    console.log('game over');
    const resultPage = new ResultPage(this.container, this.result);
    resultPage.start();
    console.log(resultPage);
  }

  muteButtonHandler = () => {
    this.muteButton.innerHTML = this.isMute ? 'volume_up' : 'volume_off';
    this.isMute = !this.isMute;
  };

  playAnswerSound(isCorrect: boolean) {
    if (this.isMute) return;
    const audio = new Audio(`./assets/audiocall/sounds/${isCorrect}.mp3`);
    audio.addEventListener('canplaythrough', audio.play);
  }

  closeButtonHandler = () => {
    this.container.remove();
  };
}
