import { WordUI } from './Word';
import createNode from '../utils/createNode';
import { Word } from '../types/interfaces';
import { Api } from '../Model/api';
import { MAX_PAGE_NUMBER } from '../utils/constants';

export class TextBook {
  textBook: HTMLDivElement;

  cardsWrapper: HTMLDivElement;

  level1Btns: HTMLButtonElement[];

  auduoCallBtn: HTMLAnchorElement;

  sprintBtn: HTMLAnchorElement;

  api: Api = new Api();

  currentPage: number = 0;

  currentLevel: number = 0;

  prevPageBtn: HTMLButtonElement;

  nextPageBtn: HTMLButtonElement;

  pageInput: HTMLInputElement;

  constructor(numberOfLevels: number) {
    this.textBook = createNode({ tag: 'section', classes: ['textbook'] }) as HTMLDivElement;
    this.cardsWrapper = createNode({ tag: 'div', classes: ['cards-wrapper'] }) as HTMLDivElement;
    this.level1Btns = this.createLevelButtons(numberOfLevels);
    this.auduoCallBtn = createNode({
      tag: 'a', classes: ['btn'], inner: 'Аудиовызов', atributesAdnValues: [['href', '/audiocall'], ['data-navigo', 'true']],
    }) as HTMLAnchorElement;
    this.sprintBtn = createNode({
      tag: 'a', classes: ['btn'], inner: 'Спринт', atributesAdnValues: [['href', '/sprint'], ['data-navigo', 'true']],
    }) as HTMLAnchorElement;
    this.prevPageBtn = createNode({ tag: 'button', classes: ['btn'], inner: 'Предыдущая' }) as HTMLButtonElement;
    this.nextPageBtn = createNode({ tag: 'button', classes: ['btn'], inner: 'Следующая' }) as HTMLButtonElement;
    this.pageInput = createNode({ tag: 'input', classes: ['page-input'], atributesAdnValues: [['type', 'number']] }) as HTMLInputElement;
    this.pageInput.value = String(this.currentPage + 1);
  }

  listenLevels(handler: (group: string, page: string) => void) {
    this.level1Btns.forEach((button) => {
      button.addEventListener('click', (e: Event) => {
        this.level1Btns.map((btn) => btn.classList.remove('btn-active'));
        button.classList.add('btn-active');
        this.currentPage = 0;
        this.pageInput.value = String(this.currentPage + 1);
        const target: number = Number((e.target as HTMLButtonElement).innerHTML);
        const level = target - 1;
        this.handlePageButtons();
        handler(String(level), '0');
      });
    });
  }

  listenPagination(handler: (group: string, page: string) => void) {
    this.prevPageBtn.addEventListener('click', () => {
      const level = this.handleLevelButtons();
      this.currentPage -= 1;
      this.pageInput.value = String(this.currentPage + 1);
      this.handleInput(this.pageInput);
      this.handlePageButtons();
      handler(String(level), String(this.currentPage));
    });
    this.nextPageBtn.addEventListener('click', () => {
      const level = this.handleLevelButtons();
      this.currentPage += 1;
      this.pageInput.value = String(this.currentPage + 1);
      this.handleInput(this.pageInput);
      this.handlePageButtons();
      handler(String(level), String(this.currentPage));
    });
    this.pageInput.addEventListener('input', (e: Event) => {
      const level = this.handleLevelButtons();
      const newPageNumber: number = Number((e.target as HTMLInputElement).value);
      this.currentPage = newPageNumber - 1;
      this.handleInput(this.pageInput);
      this.handlePageButtons();
      handler(String(level), String(this.currentPage));
    });
  }

  // Handle changes when switching pages (buttons and input) and levels
  private handlePageButtons() {
    console.log(this.currentPage);
    if (this.currentPage > 0) {
      this.prevPageBtn.disabled = false;
    } else if (this.currentPage <= 0) {
      this.prevPageBtn.disabled = true;
    } else {
      this.prevPageBtn.disabled = false;
    }
    if (this.currentPage === 29) {
      this.nextPageBtn.disabled = true;
    } else {
      this.nextPageBtn.disabled = false;
    }
  }

  private handleLevelButtons() {
    const levelBtn = this.level1Btns.filter((btn) => btn.classList.contains('btn-active'));
    const level = levelBtn.length > 0 ? Number(levelBtn[0].innerHTML) - 1 : '0';
    return level;
  }

  private handleInput(input: HTMLInputElement) {
    const currInput = input;
    if (Number(input.value) > MAX_PAGE_NUMBER) {
      currInput.value = '30';
      this.currentPage = 29;
    } else if (Number(input.value) <= 0) {
      currInput.value = '1';
      this.currentPage = 0;
    } else {
      currInput.value = String(this.currentPage + 1);
    }
    return currInput;
  }

  // Render TextBook and components
  public startTextBook(data: Word[]) {
    const container: HTMLElement = document.querySelector('.main') as HTMLElement;
    console.log(container);
    container.innerHTML = '';
    const textBook = this.renderTextBook(data);
    container.append(textBook);
  }

  public renderTextBook(data: Word[]): HTMLDivElement {
    this.textBook.innerHTML = '';
    const page: HTMLDivElement = createNode({ tag: 'div', classes: ['text-book-page'] }) as HTMLDivElement;
    const pageHead: HTMLDivElement = createNode({ tag: 'div', classes: ['text-book-page-head'] }) as HTMLDivElement;
    const pageHeadText: HTMLParagraphElement = createNode({ tag: 'p', classes: ['page-head-wrapper'], inner: 'Играть с текущим набором слов:' }) as HTMLParagraphElement;
    pageHead.append(pageHeadText, this.auduoCallBtn, this.sprintBtn);
    this.renderCards(data);
    const paginationWrapper: HTMLDivElement = createNode({ tag: 'div', classes: ['pagination'] }) as HTMLDivElement;
    this.prevPageBtn.disabled = true;
    this.nextPageBtn.disabled = false;
    paginationWrapper.append(this.prevPageBtn, this.pageInput, this.nextPageBtn);
    page.append(pageHead, this.cardsWrapper, paginationWrapper);
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
