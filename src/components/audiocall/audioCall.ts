import { api } from '../Model/api';
import { storage } from '../Storage/Storage';
import { GAME } from '../types/enums';
import {
  AuthorizationData, GameResult, Word, UserAggregatedWord,
} from '../types/interfaces';
import { convertAggregatedWordToWord } from '../utils/convertAggregatedWordToWord';
import createNode from '../utils/createNode';
import { getRandomWordsByGroup } from '../utils/getRandomWords';
import { shuffleArray } from '../utils/shuffleArray';
import { WordController } from '../WordController/WordController';
import { LevelSelect } from './levelSelect';
import { ResultPage } from './resultPage';
import { Stage } from './stage';
import { StartPage } from './startPage';

const MAX_COUNT_WORDS_PER_GAME = 10;
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

  private userData: AuthorizationData | null;

  private wordController: WordController;

  constructor() {
    this.wordController = new WordController();
    this.container = createNode({ tag: 'div', classes: ['audio-call'] });
    this.closeButton = createNode({
      tag: 'a',
      classes: ['close-button'],
      atributesAdnValues: [['href', '/'], ['data-navigo', 'true']],
      // inner: 'X',
    });
    this.muteButton = createNode({ tag: 'span', classes: ['material-icons-round', 'mute-button'], inner: 'audiotrack' });
    this.userData = storage.getUserIdData();
  }

  public start(settings?: { group: number, page: number }) {
    this.render();
    if (!settings) {
      const levelSelect = new LevelSelect(this.container, this.startGameFromMenu.bind(this));
      levelSelect.render();
    } else {
      this.closeButton.setAttribute('href', '/book');
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
  }

  private async startGameFromMenu(wordsGroup: string) {
    this.words = await getRandomWordsByGroup(wordsGroup, MAX_COUNT_WORDS_PER_GAME);
    this.startGameStage();
  }

  private async startGameFromBook() {
    if (this.settings) this.words = await this.getWordsForGame(this.settings);
    if (this.words.length === 0) {
      const levelSelect = new LevelSelect(this.container, this.startGameFromMenu.bind(this));
      levelSelect.render();
      return;
    }
    this.startGameStage();
  }

  private async getWordsForGame(settings: { group: string, page: string }) {
    if (!this.userData) {
      const wordsOnPage = await api.getWords(settings);
      return shuffleArray(wordsOnPage).slice(0, MAX_COUNT_WORDS_PER_GAME);
    }
    // game from group 6
    if (settings.group === '6') {
      const userAggregatedWords = await this.wordController.getUserBookWords();
      const words = (userAggregatedWords as UserAggregatedWord[])
        .map((word) => convertAggregatedWordToWord(word));
      return shuffleArray(words).slice(0, MAX_COUNT_WORDS_PER_GAME);
    }
    // game from group 0-5
    let userAggregatedWords = await this.getAggregatedWords(settings);
    let page = Number(settings.page);
    while (userAggregatedWords.length < MAX_COUNT_WORDS_PER_GAME && Number(page) > 0) {
      page -= 1;
      userAggregatedWords = userAggregatedWords.concat(
        // eslint-disable-next-line no-await-in-loop
        await this.getAggregatedWords({ group: settings.group, page: String(page) }),
      );
    }
    const words = userAggregatedWords.map((word) => convertAggregatedWordToWord(word));
    return words.slice(0, MAX_COUNT_WORDS_PER_GAME);
  }

  private async getAggregatedWords(settings: { group: string, page: string }) {
    let userAggregatedWords = await api.getAggregatedUserWords(
      this.userData as AuthorizationData,
      { page: settings.page, group: settings.group, wordsPerPage: '20' },
    ) as UserAggregatedWord[];
    userAggregatedWords = userAggregatedWords.filter((word) => !word?.userWord?.optional?.learned);
    return shuffleArray(userAggregatedWords);
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
    this.wordController.sendWordOnServer(word.id, stageResult, GAME.AUDIOCALL);
    if (stageResult) this.result.correct.push(word);
    else this.result.incorrect.push(word);

    if (this.currentStage < this.words.length - 1
      && this.result.incorrect.length < INCORRECT_SERIES) {
      this.currentStage += 1;
      this.startGameStage();
    } else { this.endGameHandler(); }
  }

  private endGameHandler() {
    const resultPage = new ResultPage(this.container, this.result, this.settings);
    resultPage.start();
  }

  private muteButtonHandler = () => {
    this.muteButton.innerHTML = this.isMute ? 'audiotrack' : 'music_off';
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
