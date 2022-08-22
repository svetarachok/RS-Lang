import Navigo from 'navigo';
import { TextBook } from '../textBook/TextBook';
import { Api } from '../Model/api';
import { Sprint } from '../sprint/Sprint';

export class Controller {
  router: Navigo;

  api: Api;

  textBook: TextBook;

  sprint: Sprint;

  constructor() {
    this.router = new Navigo('/', { hash: true });
    this.api = new Api();
    this.textBook = new TextBook(6);
    this.sprint = new Sprint();
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
        this.initSprint();
      })
      .on('/audiocall', () => {
        console.log('Render audiocall page');
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

  public initSprint() {
    this.sprint.renderGame();
  }
}
