import Api from '../Model/api';
import { Word } from '../types/interfaces';
import { getRandomWordsByGroup } from '../utils/getRandomWords';
import { LevelSelect } from './levelSelect';
import { Stage } from './stage';

const COUNT_WORDS_PER_GAME = 10;

export class AudioCall {
  container: HTMLElement = document.querySelector('main') as HTMLElement;

  api: Api = new Api();

  words: Word[] = [];

  start() {
    console.log('start');
    new LevelSelect(this.container, this.startGame.bind(this)).createSelect();
  }

  async startGame(wordsGroup: string) {
    this.words = await getRandomWordsByGroup(wordsGroup, COUNT_WORDS_PER_GAME);
    console.log(this.words);
    this.startGameStage();
  }

  startGameStage() {
    const stage = new Stage(this.container, this.words[0]);
    stage.start();
  }
}
