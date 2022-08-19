import { WordUI } from './Word';
import createNode from '../utils/createNode';
import { Word } from '../types/interfaces';

export class TextBook {
  textBook: HTMLDivElement;

  level1Btns: HTMLButtonElement[];

  auduoCallBtn: HTMLElement;

  sprintBtn: HTMLElement;

  constructor(numberOfLevels: number) {
    this.textBook = createNode({ tag: 'section', classes: ['textbook'] }) as HTMLDivElement;
    this.level1Btns = this.createLeveluttons(numberOfLevels);
    this.auduoCallBtn = createNode({ tag: 'button', classes: ['btn'], inner: 'Аудиовызов' });
    this.sprintBtn = createNode({ tag: 'button', classes: ['btn'], inner: 'Спринт' });
    // this.pagination = createPagination();
  }

  public renderTextBook(cardsData: Word[]): HTMLDivElement {
    const page = this.renderPage(cardsData);
    const sidebar = this.rendeSidebar();
    this.textBook.append(sidebar, page);
    return this.textBook;
  }

  private renderPage(cardsData: Word[]) {
    const page: HTMLDivElement = createNode({ tag: 'div', classes: ['text-book-page'] }) as HTMLDivElement;
    const pageHead: HTMLDivElement = createNode({ tag: 'div', classes: ['text-book-page-head'] }) as HTMLDivElement;
    const pageHeadText: HTMLParagraphElement = createNode({ tag: 'p', classes: ['cards-wrapper'], inner: 'Играть с текущим набором слов:' }) as HTMLParagraphElement;
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
    this.level1Btns.forEach((btn) => sideBar.append(btn));
    return sideBar;
  }

  private createLeveluttons(levelsNumber: number) {
    const arr: HTMLButtonElement[] = [];
    let i: number = 1;
    while (levelsNumber) {
      const btn = createNode({ tag: 'button', classes: ['btn-level'], inner: `${i}` }) as HTMLButtonElement;
      arr.push(btn);
      i += 1;
    }
    return arr;
  }
}
