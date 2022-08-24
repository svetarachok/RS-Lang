import Navigo from 'navigo';
import { TextBook } from '../textBook/TextBook';
import { Api } from '../Model/api';
import { Sprint } from '../sprint/Sprint';
import { AudioCall } from '../audiocall/audioCall';

export class Controller {
  router: Navigo;

  api: Api;

  textBook: TextBook;

  sprint: Sprint | undefined;

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
        this.closeSprint();
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
        this.initAudioCallfromMenu();
        console.log('Render audiocall from menu');
      })
      .on('/book/audiocall', () => {
        this.initAudioCallfromBook();
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
    this.sprint = new Sprint('book');
    this.sprint.setBookPageAndLevel(this.textBook.currentLevel, this.textBook.currentPage);
    this.sprint.renderGame();
    console.log('from book');
  }

  private initSprintFromMenu() {
    this.sprint = new Sprint('menu');
    this.sprint.renderGame();
    console.log('from menu');
  }

  private closeSprint() {
    this.sprint?.closeGame();
  }

  public initAudioCallfromMenu() {
    const game = new AudioCall();
    game.start();
  }

  public initAudioCallfromBook() {
    const game = new AudioCall();
    game.start({ group: this.textBook.currentLevel, page: this.textBook.currentPage });
  }
}
