import createNode from '../utils/createNode';

export class MainPage {
  renderMain() {
    const container: HTMLElement = document.querySelector('.main') as HTMLElement;
    container.innerHTML = '';
    const template = createNode({ tag: 'div', classes: ['main-page'], inner: 'Main Page' });
    container.append(template);
    return container;
  }
}
