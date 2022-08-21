import { GameResult, Word } from '../types/interfaces';
import createNode from '../utils/createNode';
import { getRandomWordsByGroup } from '../utils/getRandomWords';
import { LevelSelect } from './levelSelect';
import { ResultPage } from './resultPage';
import { Stage } from './stage';

const COUNT_WORDS_PER_GAME = 10;

export class AudioCall {
  container: HTMLElement;

  words: Word[] = [];

  result: GameResult = {
    correct: [],
    incorrect: [],
  };

  currentStage: number = 0;

  constructor() {
    this.container = createNode({ tag: 'div', classes: ['audio-call'] });
  }

  start() {
    document.querySelector('main')?.append(this.container);
    (document.querySelector('footer') as HTMLElement).style.display = 'none';
    console.log('start');
    new LevelSelect(this.container, this.startGame.bind(this)).createSelect();
  }

  async startGame(wordsGroup: string) {
    this.words = await getRandomWordsByGroup(wordsGroup, COUNT_WORDS_PER_GAME);
    console.log(this.words);
    this.startGameStage();
  }

  startGameStage() {
    const stage = new Stage(
      this.container,
      this.words[this.currentStage],
      this.stageHandler.bind(this),
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
    console.log(resultPage);
  }
}
