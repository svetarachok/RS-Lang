import Navigo from 'navigo';
import { TextBook } from '../textBook/TextBook';
import { Api } from '../Model/api';
import { Modal } from '../utils/Modal';
import { LoginForm } from '../forms/LoginForm';
import { RegisterForm } from '../forms/RegisterForm';
import { REGISTER_BTN, LOGIN_BTN, LEVELS_OF_TEXTBOOK } from '../utils/constants';
import { UserUI } from '../user/UserUI';
import { Sprint } from '../sprint/Sprint';
import { Storage } from '../Storage/Storage';
import { UserCreationData } from '../types/interfaces';

export class Controller {
  router: Navigo;

  api: Api;

  textBook: TextBook;

  sprint: Sprint;

  modal: Modal;

  loginForm: LoginForm;

  registerForm: RegisterForm;

  userUI: UserUI;

  storage: Storage;

  constructor() {
    this.router = new Navigo('/', { hash: true });
    this.api = new Api();
    this.textBook = new TextBook(LEVELS_OF_TEXTBOOK);
    this.sprint = new Sprint();
    this.modal = new Modal();
    this.loginForm = new LoginForm('login', 'Login');
    this.registerForm = new RegisterForm('register', 'Register');
    this.userUI = new UserUI();
    this.storage = new Storage();
    // this.initUserForms();
  }

  public initRouter(): void {
    this.router
      .on(() => {
        console.log('Render home page');
        this.router.updatePageLinks();
      })
      .on('/book', async () => {
        await this.handleTextBook();
        this.router.updatePageLinks();
      })
      .on('/sprint', () => {
        this.initSprint();
      })
      .on('/audiocall', () => {
        console.log('Render audiocall page');
        this.router.updatePageLinks();
      })
      .on('/user', () => {
        console.log('Render user page');
        this.userUI.renderUserPage();
        this.router.updatePageLinks();
      })
      .resolve();
  }

  public async initApp() {
    this.textBook.listenLevels(this.handleTextBoookPageUpdate.bind(this));
    this.textBook.listenPagination(this.handleTextBoookPageUpdate.bind(this));
    this.startUserForms();
    this.loginForm.listenForm(this.handleLoginBtn.bind(this));
    this.registerForm.listenForm(this.handleRegistartion.bind(this));
    this.userUI.unAuthorize(this.handleUnLogin.bind(this));
    this.handleUser();
  }

  public async handleTextBook() {
    const stored = this.storage.getData('textBook');
    const logined = this.storage.getData('UserId');
    if (stored && logined) {
      console.log('Есть локал бук и залогинен');
      const data = await this.api.getWords(stored);
      this.textBook.updateTextbook(data, true, stored.group, stored.page);
    } else if (stored && !logined) {
      console.log('Есть локал бук и НЕ залогинен');
      const data = await this.api.getWords(stored);
      this.textBook.updateTextbook(data, false, stored.group, stored.page);
    } else if (!stored && logined) {
      console.log('Не ходит по учебнику и залогинен');
      const data = await this.api.getWords(stored);
      this.textBook.updateTextbook(data, true, stored.group, stored.page);
    } else {
      console.log('Не ходит по учебнику и не залогинен');
      const data = await this.api.getWords({ group: '0', page: '0' });
      this.textBook.updateTextbook(data, false, 0, 0);
    }
  }

  public async handleTextBoookPageUpdate(groupStr: string, pageStr: string) {
    const data = await this.api.getWords({ group: groupStr, page: pageStr });
    this.storage.setData('textBook', `{"group": ${groupStr}, "page": ${pageStr}}`);
    this.textBook.updateCards(data);
    return data;
  }

  private startUserForms() {
    const loginFormHTML = this.loginForm.renderForm();
    const regFormHTML = this.registerForm.renderForm();
    REGISTER_BTN.addEventListener('click', () => this.modal.renderModal(regFormHTML));
    LOGIN_BTN.addEventListener('click', () => this.modal.renderModal(loginFormHTML));
  }

  public async handleLoginBtn(email: string, password: string) {
    const object: Pick<UserCreationData, 'email' | 'password'> = { email, password };
    const res = await this.api.authorize(object);
    if (typeof res === 'object') {
      this.storage.setData('UserId', res);
      this.modal.overLay.remove();
      document.body.classList.remove('hidden-overflow');
      this.userUI.authorise(res);
      this.router.updatePageLinks();
      await this.handleTextBook();
    } else {
      // ! Вывести текст ошибки в модалку
      console.log(res);
    }
  }

  public handleUser() {
    const stored = this.storage.getData('UserId');
    if (stored.token) {
      this.userUI.authorise(stored);
    }
  }

  public async handleRegistartion(name: string, email: string, password: string) {
    const object: UserCreationData = {
      name,
      email,
      password,
    };
    const res = await this.api.createUser(object);
    console.log(res);
  }

  private handleUnLogin() {
    this.storage.clear();
    this.router.navigate('/');
    this.router.updatePageLinks();
  }

  public initSprint() {
    this.sprint.renderGame();
  }
}
