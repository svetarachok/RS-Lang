import { WordUI } from './Word';
import createNode from '../utils/createNode';
import { Word } from '../types/interfaces';
import { Api } from '../Model/api';

export class TextBook {
  textBook: HTMLDivElement;

  level1Btns: HTMLButtonElement[];

  auduoCallBtn: HTMLElement;

  sprintBtn: HTMLElement;

  api: Api = new Api();

  constructor(numberOfLevels: number) {
    this.textBook = createNode({ tag: 'section', classes: ['textbook'] }) as HTMLDivElement;
    this.level1Btns = this.createLeveluttons(numberOfLevels);
    this.auduoCallBtn = createNode({ tag: 'button', classes: ['btn'], inner: 'Аудиовызов' });
    this.sprintBtn = createNode({ tag: 'button', classes: ['btn'], inner: 'Спринт' });
    // this.pagination = createPagination();
  }

  public async startTextBook() {
    const conatiner: HTMLElement = document.querySelector('.main') as HTMLElement;
    conatiner.innerHTML = '';
    const textBook = await this.renderTextBook();
    conatiner.append(textBook);
  }

  public async renderTextBook(): Promise<HTMLDivElement> {
    const cardsData = await this.api.getWords({ group: '0', page: '1' });
    const page = this.renderPage(cardsData);
    const sidebar = this.rendeSidebar();
    this.textBook.append(sidebar, page);
    return this.textBook;
  }

  private renderPage(cardsData: Word[]) {
    const page: HTMLDivElement = createNode({ tag: 'div', classes: ['text-book-page'] }) as HTMLDivElement;
    const pageHead: HTMLDivElement = createNode({ tag: 'div', classes: ['text-book-page-head'] }) as HTMLDivElement;
    const pageHeadText: HTMLParagraphElement = createNode({ tag: 'p', classes: ['page-head-wrapper'], inner: 'Играть с текущим набором слов:' }) as HTMLParagraphElement;
    const cardsWrapper: HTMLDivElement = createNode({ tag: 'div', classes: ['cards-wrapper'] }) as HTMLDivElement;
    pageHead.append(pageHeadText, this.auduoCallBtn, this.sprintBtn);
    cardsData.forEach((card) => {
      const cardItem = new WordUI(card);
      cardsWrapper.append(cardItem.drawCard());
    });
    page.append(pageHead, cardsWrapper);
    return page;
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

  private createLeveluttons(levelsNumber: number) {
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
