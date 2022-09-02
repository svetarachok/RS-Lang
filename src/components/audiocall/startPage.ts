import createNode from '../utils/createNode';

const AUDIO_CALL_DESCRIPTION = 'Тренировка улучшает восприятие речи на слух.';
const GAME_NAME = 'Аудиовызов';

export class StartPage {
  private container: HTMLElement;

  private callback: () => void;

  private wrapper: HTMLElement;

  private links: NodeListOf<HTMLAnchorElement>;

  constructor(container: HTMLElement, callback: ()=> void) {
    this.container = container;
    this.callback = callback;
    this.wrapper = createNode({ tag: 'div', classes: ['level-select'] });
    this.links = document.querySelectorAll('a');
  }

  public render() {
    const title = createNode({ tag: 'h2', classes: ['game__title'], inner: GAME_NAME });
    const description = createNode({ tag: 'p', classes: ['game__descpiption'], inner: AUDIO_CALL_DESCRIPTION });
    const button = createNode({ tag: 'button', atributesAdnValues: [['type', 'button']], inner: 'начать' });
    button.addEventListener('click', this.startGame);
    document.addEventListener('keydown', this.keyHandler);
    this.links.forEach((link) => link.addEventListener('click', () => {
      if (!link.href.includes('/audiocall')) {
        this.removeListeners();
        this.container.remove();
      }
    }));

    this.wrapper.append(title, description, button);
    this.container.append(this.wrapper);
  }

  private startGame = () => {
    this.wrapper.remove();
    document.removeEventListener('keydown', this.keyHandler);
    this.callback();
  };

  private keyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Enter') this.startGame();
  };

  private removeListeners = () => {
    document.removeEventListener('keydown', this.keyHandler);
    this.links.forEach((link) => link.removeEventListener('click', this.removeListeners));
  };
}
