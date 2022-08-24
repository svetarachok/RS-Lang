import { BASE_LINK } from '../utils/constants';
import createNode from '../utils/createNode';

const AUDIO_CALL_DESCRIPTION = 'Тренировка улучшает восприятие речи на слух.';
const GAME_NAME = 'Аудиовызов';

export class StartPage {
  container: HTMLElement;

  callback: () => void;

  wrapper: HTMLElement;

  links: NodeListOf<HTMLAnchorElement>;

  constructor(container: HTMLElement, callback: ()=> void) {
    this.container = container;
    this.callback = callback;
    this.wrapper = createNode({ tag: 'div', classes: ['level-select'] });
    this.links = document.querySelectorAll('a');
  }

  render() {
    const title = createNode({ tag: 'h2', classes: ['game__title'], inner: GAME_NAME });
    const description = createNode({ tag: 'p', classes: ['game__descpiption'], inner: AUDIO_CALL_DESCRIPTION });
    const button = createNode({ tag: 'button', atributesAdnValues: [['type', 'button']], inner: 'начать' });
    button.addEventListener('click', this.startGame);
    document.addEventListener('keydown', this.keyHandler);
    this.links.forEach((link) => link.addEventListener('click', () => {
      if (link.href !== `${BASE_LINK}/audiocall`) {
        this.removeListeners();
        this.container.remove();
      }
    }));

    this.wrapper.append(title, description, button);
    this.container.append(this.wrapper);
  }

  startGame = () => {
    this.wrapper.remove();
    document.removeEventListener('keydown', this.keyHandler);
    this.callback();
  };

  keyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Enter') this.startGame();
  };

  removeListeners = () => {
    document.removeEventListener('keydown', this.keyHandler);
    this.links.forEach((link) => link.removeEventListener('click', this.removeListeners));
  };
}
