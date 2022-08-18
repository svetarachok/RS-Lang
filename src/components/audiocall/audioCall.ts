import { LevelSelect } from './levelSelect';

export class AudioCall {
  container: HTMLElement = document.querySelector('main') as HTMLElement;

  wordsGroup:string = '1';

  start() {
    console.log('start');
    new LevelSelect(this.container, this.startGame.bind(this)).createSelect();
  }

  startGame(wordsGroup: string) {
    console.log(wordsGroup);
  }
}
