import { GameResult } from '../types/interfaces';
import createNode from '../utils/createNode';

export class ResultPage {
  container: HTMLElement;

  result: GameResult;

  wrapper: HTMLElement;

  constructor(container: HTMLElement, result: GameResult) {
    this.container = container;
    this.result = result;
    this.wrapper = createNode({ tag: 'div', classes: ['game-result'] });
  }

  start() {
    this.render();
  }

  render() {
    const getTitleText = this.getTitleText();
    const title = createNode({ tag: 'h2', classes: ['game-result__title'], inner: 'title' });
    console.log(title);
    console.log(getTitleText);
  }

  getTitleText() {
    throw new Error('Method not implemented.');
  }
}
