import { WordUI } from './Word';
import createNode from '../utils/createNode';
import { Word } from '../types/interfaces';
import { Api } from '../Model/api';

export class TextBook {
  textBook: HTMLDivElement;

  cardsWrapper: HTMLDivElement;

  level1Btns: HTMLButtonElement[];

  auduoCallBtn: HTMLButtonElement;

  sprintBtn: HTMLButtonElement;

  api: Api = new Api();

  currentPage: number = 1;

  currentLevel: number = 0;

  prevPageBtn: HTMLButtonElement;

  nextPageBtn: HTMLButtonElement;

  pageInput: HTMLInputElement;

  constructor(numberOfLevels: number) {
    this.textBook = createNode({ tag: 'section', classes: ['textbook'] }) as HTMLDivElement;
    this.cardsWrapper = createNode({ tag: 'div', classes: ['cards-wrapper'] }) as HTMLDivElement;
    this.level1Btns = this.createLevelButtons(numberOfLevels);
    this.auduoCallBtn = createNode({ tag: 'button', classes: ['btn'], inner: 'Аудиовызов' }) as HTMLButtonElement;
    this.sprintBtn = createNode({ tag: 'button', classes: ['btn'], inner: 'Спринт' }) as HTMLButtonElement;
    this.prevPageBtn = createNode({ tag: 'button', classes: ['btn'], inner: 'Предыдущая' }) as HTMLButtonElement;
    this.nextPageBtn = createNode({ tag: 'button', classes: ['btn'], inner: 'Следующая' }) as HTMLButtonElement;
    this.pageInput = createNode({ tag: 'input', classes: ['page-input'] }) as HTMLInputElement;
    this.pageInput.value = String(this.currentPage);
  }

  listenLevels(handler: (group: string, page: string) => void) {
    this.level1Btns.forEach((button) => {
      button.addEventListener('click', (e: Event) => {
        const target: number = Number((e.target as HTMLButtonElement).innerHTML);
        const level = target - 1;
        handler(String(level), '1');
      });
    });
  }

  listenPages(handler: (group: string, page: string) => void) {
    this.level1Btns.forEach((button) => {
      button.addEventListener('click', (e: Event) => {
        const target: number = Number((e.target as HTMLButtonElement).innerHTML);
        const level = target - 1;
        handler(String(level), '1');
      });
    });
  }

  public startTextBook(data: Word[]) {
    const conatiner: HTMLElement = document.querySelector('.main') as HTMLElement;
    conatiner.innerHTML = '';
    const textBook = this.renderTextBook(data);
    conatiner.append(textBook);
  }

  public renderTextBook(data: Word[]): HTMLDivElement {
    const conatiner: HTMLElement = document.querySelector('.main') as HTMLElement;
    conatiner.innerHTML = '';
    const page: HTMLDivElement = createNode({ tag: 'div', classes: ['text-book-page'] }) as HTMLDivElement;
    const pageHead: HTMLDivElement = createNode({ tag: 'div', classes: ['text-book-page-head'] }) as HTMLDivElement;
    const pageHeadText: HTMLParagraphElement = createNode({ tag: 'p', classes: ['page-head-wrapper'], inner: 'Играть с текущим набором слов:' }) as HTMLParagraphElement;
    pageHead.append(pageHeadText, this.auduoCallBtn, this.sprintBtn);
    this.renderCards(data);
    page.append(pageHead, this.cardsWrapper);
    const sidebar = this.rendeSidebar();
    this.textBook.append(sidebar, page);
    return this.textBook;
  }

  public updateCards(data: Word[]) {
    this.cardsWrapper.innerHTML = '';
    this.renderCards(data);
  }

  private renderCards(cardsData: Word[]) {
    cardsData.forEach((card) => {
      const cardItem = new WordUI(card);
      this.cardsWrapper.append(cardItem.drawCard());
    });
    return this.cardsWrapper;
  }

  private rendeSidebar(): HTMLElement {
    const sideBar: HTMLElement = createNode({ tag: 'aside', classes: ['aside'] });
    const sideBarContent: HTMLElement = createNode({ tag: 'div', classes: ['sidebar-content'] });
    const sidebarText: HTMLParagraphElement = createNode({ tag: 'p', classes: ['sidebar-text'], inner: 'Уровни сложности' }) as HTMLParagraphElement;
    sideBarContent.append(sidebarText);
    this.level1Btns.forEach((btn) => sideBarContent.append(btn));
    sideBar.append(sideBarContent);
    return sideBar;
  }

  private createLevelButtons(levelsNumber: number) {
    const arr: HTMLButtonElement[] = [];
    let i: number = 1;
    while (levelsNumber) {
      const btn = createNode({ tag: 'button', classes: ['btn-level'], inner: `${i}` }) as HTMLButtonElement;
      arr.push(btn);
      i += 1;
      // eslint-disable-next-line no-param-reassign
      levelsNumber -= 1;
    }
    return arr;
  }
}
