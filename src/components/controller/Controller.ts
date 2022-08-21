import { TextBook } from '../textBook/TextBook';
import { Api } from '../Model/api';
import { Sprint } from '../sprint/Sprint';

export class Controller {
  textBook: TextBook;

  api: Api;

  sprint: Sprint;

  constructor() {
    this.textBook = new TextBook(6);
    this.api = new Api();
    this.sprint = new Sprint();
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
    this.sprint.penderGame();
  }
}
