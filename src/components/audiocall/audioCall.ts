import createNode from '../utils/createNode';

const AUDIO_CALL_DESCRIPTION = 'Тренировка улучшает восприятие речи на слух.';
const GAME_NAME = 'Аудиовызов';
const LEVEL_COUNT = 6;

export class AudioCall {
  container: HTMLElement | null;

  wordsGroup:string = '1';

  constructor() {
    this.container = document.querySelector('main');
  }

  start() {
    console.log('start');
    console.log(this.container);
    this.renderSelectView();
  }

  renderSelectView() {
    console.log('this.renderSelectView');
    const wrapper = createNode({ tag: 'div', classes: ['game'] });
    const title = createNode({ tag: 'h2', classes: ['game__title'], inner: GAME_NAME });
    const description = createNode({ tag: 'p', classes: ['game__descpiption'], inner: AUDIO_CALL_DESCRIPTION });
    const selectBlock = this.createSelectBlock('Выбери уровень сложности');
    const button = createNode({ tag: 'button', atributesAdnValues: [['type', 'button']], inner: 'начать' });
    this.addStartGameHandler(button);

    wrapper.append(title, description, selectBlock, button);
    this.container?.append(wrapper);
  }

  createSelectBlock(title: string) {
    const wrapper = createNode({ tag: 'div', classes: ['select-block'] });
    const titleNode = createNode({ tag: 'div', classes: ['select-block__title'], inner: title });
    const select = createNode({ tag: 'select', classes: ['select-block__select'] });
    for (let i = 1; i <= LEVEL_COUNT; i += 1) {
      const option = createNode({ tag: 'option', atributesAdnValues: [['value', String(i)]], inner: String(i) });
      if (i === 1) (option as HTMLOptionElement).selected = true;
      select.append(option);
    }
    this.addSelectHandler(select as HTMLSelectElement);
    wrapper.append(titleNode, select);
    return wrapper;
  }

  addSelectHandler(select: HTMLSelectElement) {
    select.addEventListener('change', () => {
      this.wordsGroup = select.value;
      console.log(this.wordsGroup);
    });
  }

  addStartGameHandler(button: HTMLElement) {
    button.addEventListener('click', this.startGame);
  }

  startGame() {
    console.log('this.startGame');
  }
}
