import Navigo from 'navigo';
import { TextBook } from '../textBook/TextBook';
import { Api } from '../Model/api';
import { Sprint } from '../sprint/Sprint';

export class Controller {
  router: Navigo;

  api: Api;

  textBook: TextBook;

  constructor() {
    this.router = new Navigo('/', { hash: true });
    this.api = new Api();
    this.textBook = new TextBook(6);
  }

  public initRouter(): void {
    this.router
      .on(() => {
        console.log('Render home page');
      })
      .on('/book', async () => {
        await this.initTextBook();
        this.router.updatePageLinks();
      })
      .on('/sprint', () => {
        this.initSprintFromMenu();
      })
      .on('/book/sprint', () => {
        this.initSprintFromBook();
      })
      .on('/audiocall', () => {
        console.log('Render audiocall from menu');
      })
      .on('/book/audiocall', () => {
        console.log('Render audiocall from book');
      })
      .on('/statistic', () => {
        console.log('Render statistic page');
      })
      .resolve();
  }

  public async initTextBook() {
    const data = await this.api.getWords({ group: '0', page: '0' });
    this.handlePageUpdate = this.handlePageUpdate.bind(this);
    this.textBook.startTextBook(data);
    this.textBook.listenLevels(this.handlePageUpdate);
    this.textBook.listenPagination(this.handlePageUpdate);
  }

  public async handlePageUpdate(groupStr: string, pageStr: string) {
    const data = await this.api.getWords({ group: groupStr, page: pageStr });
    this.textBook.updateCards(data);
    return data;
  }

  private initSprintFromBook() {
    const sprint = new Sprint('book');
    sprint.setBookPageAndLevel(this.textBook.currentLevel, this.textBook.currentPage);
    sprint.renderGame();
    console.log('from book');
    console.log(sprint.bookLevel, sprint.bookPage);
  }

  private initSprintFromMenu() {
    const sprint = new Sprint('menu');
    sprint.renderGame();
    console.log('from menu');
  }
}
