import Navigo from 'navigo';
import { TextBook } from '../textBook/TextBook';
import { Api } from '../Model/api';
import { Modal } from '../utils/Modal';
import { LoginForm } from '../forms/LoginForm';
import { RegisterForm } from '../forms/RegisterForm';
import {
  REGISTER_BTN, LOGIN_BTN, LEVELS_OF_TEXTBOOK, APP_LINK, WORDS_PER_PAGE,
} from '../utils/constants';
import { UserUI } from '../user/UserUI';
import { Sprint } from '../sprint/Sprint';
import { AudioCall } from '../audiocall/audioCall';
import { Storage } from '../Storage/Storage';
import { UserCreationData } from '../types/interfaces';
import { MainPage } from '../MainPage/MainPage';
import { BurgerMenu } from '../utils/BurgerMenu';

export class Controller {
  router: Navigo;

  api: Api;

  textBook: TextBook;

  sprint: Sprint | undefined;

  modal: Modal;

  loginForm: LoginForm;

  registerForm: RegisterForm;

  userUI: UserUI;

  storage: Storage;

  mainPage: MainPage;

  menu: BurgerMenu;

  constructor() {
    this.router = new Navigo('/', { hash: true });
    this.api = new Api();
    this.textBook = new TextBook(LEVELS_OF_TEXTBOOK);
    this.modal = new Modal();
    this.loginForm = new LoginForm('login', 'Login');
    this.registerForm = new RegisterForm('register', 'Register');
    this.userUI = new UserUI();
    this.storage = new Storage();
    this.mainPage = new MainPage();
    this.menu = new BurgerMenu();
    // this.initUserForms();
  }

  public initRouter(): void {
    this.router
      .on(() => {
        console.log('Render home page');
        this.handleUser();
        this.closeSprint();
        this.mainPage.renderMain();
        this.router.updatePageLinks();
      })
      .on('/book', async () => {
        this.closeSprint();
        await this.handleTextBook();
        this.router.updatePageLinks();
      })
      .on('/sprint', () => {
        this.closeSprint();
        this.initSprintFromMenu();
      })
      .on('/book/sprint', () => {
        this.closeSprint();
        this.initSprintFromBook();
      })
      .on('/audiocall', () => {
        this.closeSprint();
        this.initAudioCallfromMenu();
        console.log('Render audiocall from menu');
      })
      .on('/book/audiocall', () => {
        this.closeSprint();
        this.initAudioCallfromBook();
        console.log('Render audiocall from book');
      })
      .on('/user', () => {
        console.log('Render user page');
        this.closeSprint();
        this.handleUser();
        this.userUI.renderUserPage();
        this.router.updatePageLinks();
      })
      .resolve();
  }

  public async initApp() {
    this.menu.initBurgerMenu();
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
      console.log(logined.token);
      const newData = await this.api.getAggrWords(
        { token: logined.token, userId: logined.userId },
        { group: stored.group, page: stored.page, wordsPerPage: String(WORDS_PER_PAGE) },
      );
      console.log(newData);
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
      this.modal.exitModal();
      this.storage.setData('UserId', res);
      this.userUI.authorise(res);
      if (window.location.href === `${APP_LINK}/#/book`) {
        console.log('boook');
        await this.handleTextBook();
      }
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
    // if ()
  }

  public async handleRegistartion(name: string, email: string, password: string) {
    const object: UserCreationData = { name, email, password };
    await this.api.createUser(object);
    const obj: Pick<UserCreationData, 'email' | 'password'> = { email, password };
    const res = await this.api.authorize(obj);
    // this.modal.showMessage('Успешная регистрация! <Войдите в аккаунт')
    if (typeof res === 'object') {
      console.log('123');
      this.modal.exitModal();
      this.storage.setData('UserId', res);
      this.userUI.authorise(res);
      if (window.location.href === `${APP_LINK}/book`) {
        await this.handleTextBook();
      }
    }
  }

  private handleUnLogin() {
    this.storage.clear();
    this.router.navigate('/');
    this.router.updatePageLinks();
  }

  private initSprintFromBook() {
    this.sprint = new Sprint('book');
    this.sprint.setBookPageAndLevel(this.textBook.currentLevel, this.textBook.currentPage);
    this.sprint.renderGame();
  }

  private initSprintFromMenu() {
    this.sprint = new Sprint('menu');
    this.sprint.renderGame();
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
