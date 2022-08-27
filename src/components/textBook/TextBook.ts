import { WordUI } from './Word';
import createNode from '../utils/createNode';
import { UserAggregatedWord, Word } from '../types/interfaces';
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
      tag: 'a', classes: ['btn'], inner: 'Аудиовызов', atributesAdnValues: [['href', '/book/audiocall'], ['data-navigo', 'true']],
    }) as HTMLAnchorElement;
    this.sprintBtn = createNode({
      tag: 'a', classes: ['btn'], inner: 'Спринт', atributesAdnValues: [['href', '/book/sprint'], ['data-navigo', 'true']],
    }) as HTMLAnchorElement;
    this.prevPageBtn = createNode({ tag: 'button', classes: ['btn'], inner: 'Предыдущая' }) as HTMLButtonElement;
    this.nextPageBtn = createNode({ tag: 'button', classes: ['btn'], inner: 'Следующая' }) as HTMLButtonElement;
    this.pageInput = createNode({ tag: 'input', classes: ['page-input'], atributesAdnValues: [['type', 'number']] }) as HTMLInputElement;
    this.pageInput.value = String(this.currentPage + 1);
  }

  // Update textBook and cards separately
  public updateTextbook(
    data: Word[] | UserAggregatedWord[],
    flag: Boolean,
    group: number,
    page?: number,
  ) {
    this.textBook.innerHTML = '';
    this.renderTextBook(data);
    if (typeof group === 'number' && typeof page === 'number') {
      this.level1Btns.map((btn) => btn.classList.remove('btn-active'));
      this.level1Btns[group].classList.add('btn-active');
      this.currentLevel = group;
      this.currentPage = page;
      this.pageInput.value = String(page + 1);
      this.handlePageButtons();
    }
    if (flag === true) {
      this.level1Btns[6].style.display = 'flex';
      const learnBtns = document.querySelectorAll('.btn-learn') as NodeListOf<HTMLElement>;
      const hardBtns = document.querySelectorAll('.btn-add') as NodeListOf<HTMLElement>;
      // eslint-disable-next-line no-param-reassign, no-return-assign
      learnBtns.forEach((btn) => btn.style.display = 'flex');
      // eslint-disable-next-line no-param-reassign, no-return-assign
      hardBtns.forEach((btn) => btn.style.display = 'flex');
    }
  }

  public updateCards(data: Word[] | UserAggregatedWord[]) {
    this.cardsWrapper.innerHTML = '';
    this.renderCards(data);
  }

  // Listen level buttons and pagination

  listenLevels(handler: (group: string, page: string) => void) {
    this.level1Btns.forEach((button) => {
      button.addEventListener('click', (e: Event) => {
        this.level1Btns.map((btn) => btn.classList.remove('btn-active'));
        button.classList.add('btn-active');
        this.currentPage = 0;
        this.pageInput.value = String(this.currentPage + 1);
        const target: number = Number((e.target as HTMLButtonElement).innerHTML);
        const level = target - 1;
        this.currentLevel = level;
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
  public renderTextBook(data: Word[] | UserAggregatedWord[]): HTMLElement {
    const container: HTMLElement = document.querySelector('.main') as HTMLElement;
    container.innerHTML = '';
    const page: HTMLDivElement = createNode({ tag: 'div', classes: ['text-book-page'] }) as HTMLDivElement;
    const pageHead: HTMLDivElement = this.renderTBHeader();
    const sidebar = this.rendeSidebar();
    this.renderCards(data);
    const paginationWrapper: HTMLDivElement = this.renderPagination();
    paginationWrapper.append(this.prevPageBtn, this.pageInput, this.nextPageBtn);
    page.append(pageHead, this.cardsWrapper, paginationWrapper);
    this.textBook.append(sidebar, page);
    container.append(this.textBook);
    return container;
  }

  private renderTBHeader() {
    const pageHead: HTMLDivElement = createNode({ tag: 'div', classes: ['text-book-page-head'] }) as HTMLDivElement;
    const pageHeadText: HTMLParagraphElement = createNode({ tag: 'p', classes: ['page-head-wrapper'], inner: 'Играть с текущим набором слов:' }) as HTMLParagraphElement;
    pageHead.append(pageHeadText, this.auduoCallBtn, this.sprintBtn);
    return pageHead;
  }

  private renderCards(cardsData: Word[] | UserAggregatedWord[]) {
    this.cardsWrapper.innerHTML = '';
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
    this.level1Btns[6].classList.add('user-words-btn');
    this.level1Btns[6].style.display = 'none';
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

  private renderPagination(): HTMLDivElement {
    const paginationWrapper: HTMLDivElement = createNode({ tag: 'div', classes: ['pagination'] }) as HTMLDivElement;
    this.prevPageBtn.disabled = true;
    this.nextPageBtn.disabled = false;
    paginationWrapper.append(this.prevPageBtn, this.pageInput, this.nextPageBtn);
    return paginationWrapper;
  }
}
