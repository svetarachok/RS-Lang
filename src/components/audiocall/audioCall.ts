import Api from '../Model/api';
import { randomInteger } from '../utils/getRandomInteger';
import { shuffleArray } from '../utils/shuffleArray';
import { LevelSelect } from './levelSelect';

const COUNT_WORDS_PER_GAME = 10;
const MAX_PAGE_NUMBER = 29;

export class AudioCall {
  container: HTMLElement = document.querySelector('main') as HTMLElement;

  api: Api = new Api();

  start() {
    console.log('start');
    new LevelSelect(this.container, this.startGame.bind(this)).createSelect();
  }

  startGame(wordsGroup: string) {
    const words = this.generateWordsForGame(wordsGroup, COUNT_WORDS_PER_GAME);
    console.log(words);
  }

  async generateWordsForGame(group: string, count: number) {
    const randomPageNumber = randomInteger(1, MAX_PAGE_NUMBER);
    const words = await this.api.getWords({ group, page: String(randomPageNumber) });
    const randomWords = shuffleArray(words).slice(0, count);
    return randomWords;
  }
}
