import Navigo from 'navigo';
import { TextBook } from '../textBook/TextBook';
import { Api } from '../Model/api';
import { Modal } from '../utils/Modal';
import { LoginForm } from '../forms/LoginForm';
import { RegisterForm } from '../forms/RegisterForm';
import {
  REGISTER_BTN, LOGIN_BTN, LEVELS_OF_TEXTBOOK, WORDS_PER_PAGE,
  REFRESHTOKEN_LIFETIME_IN_HOURS, TOKEN_LIFETIME_IN_HOURS,
} from '../utils/constants';
import { UserUI } from '../user/UserUI';
import { Sprint } from '../sprint/Sprint';
import { AudioCall } from '../audiocall/audioCall';
import { Storage } from '../Storage/Storage';
import { AuthorizationData, UserAggregatedWord, UserCreationData } from '../types/interfaces';
import { MainPage } from '../MainPage/MainPage';
import { BurgerMenu } from '../utils/BurgerMenu';
import { WordController } from '../WordController/WordController';

export const router = new Navigo('/', { hash: true });

export class Controller {
  router: Navigo = router;

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

  wordController: WordController;

  constructor() {
    this.api = new Api();
    this.textBook = new TextBook(LEVELS_OF_TEXTBOOK);
    this.modal = new Modal();
    this.loginForm = new LoginForm('login', 'Вход');
    this.registerForm = new RegisterForm('register', 'Регистрация');
    this.userUI = new UserUI();
    this.storage = new Storage();
    this.mainPage = new MainPage();
    this.menu = new BurgerMenu();
    this.wordController = new WordController();
  }

  public initRouter(): void {
    this.router
      .on(() => {
        this.mainPage.renderMain();
        this.router.updatePageLinks();
      })
      .on('/book', async () => {
        this.menu.closeMenu();
        await this.handleTextBook();
        this.router.updatePageLinks();
      })
      .on('/sprint', () => {
        this.menu.closeMenu();
        this.initSprintFromMenu();
      })
      .on('/book/sprint', () => {
        this.initSprintFromBook();
      })
      .on('/audiocall', () => {
        this.initAudioCallfromMenu();
        this.menu.closeMenu();
      })
      .on('/book/audiocall', () => {
        this.initAudioCallfromBook();
      })
      .on('/user', () => {
        this.menu.closeMenu();
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
    if (window.location.href.match(/RS-Lang\/$/)) {
      window.location.href = `${window.location.href}#/`;
    }
    this.router.updatePageLinks();
  }

  public async handleTextBook() {
    const stored = this.storage.getData('textBook');
    const logined = this.storage.getData('UserId');
    if (stored && logined) {
      if (stored.group === 6) {
        const newData = await this.wordController.getUserBookWords();
        this.textBook.updateTextbook(newData, true, 6, 0);
        // console.log('Есть локал бук и залогинен, level hard');
      } else {
        const newData = await this.api.getAggregatedUserWords(
          logined,
          { group: stored.group, page: stored.page, wordsPerPage: String(WORDS_PER_PAGE) },
        ) as UserAggregatedWord[];
        // console.log('Есть локал бук и залогинен');
        this.textBook.updateTextbook(newData, true, stored.group, stored.page);
      }
    } else if (stored && !logined) {
      // console.log('Есть локал бук и НЕ залогинен');
      const data = await this.api.getWords(stored);
      this.textBook.updateTextbook(data, false, stored.group, stored.page);
    } else if (!stored && logined) {
      const newData = await this.api.getAggregatedUserWords(
        logined,
        { group: '0', page: '0', wordsPerPage: String(WORDS_PER_PAGE) },
      ) as UserAggregatedWord[];
      // console.log('Не ходит по учебнику и залогинен');
      this.textBook.updateTextbook(newData, true, 0, 0);
    } else {
      // console.log('Не ходит по учебнику и не залогинен');
      const data = await this.api.getWords({ group: '0', page: '0' });
      this.textBook.updateTextbook(data, false, 0, 0);
    }
    this.textBook.addLinksHandler();
  }

  public async handleTextBoookPageUpdate(groupStr: string, pageStr: string) {
    this.storage.setData('textBook', `{"group": ${groupStr}, "page": ${pageStr}}`);
    this.handleTextBook();
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
      this.router.updatePageLinks();
      if (window.location.href.match(/\/book$/)) {
        await this.handleTextBook();
      }
    } else {
      const loginMess = document.querySelector('.modal-err-message');
      if (loginMess) {
        loginMess.remove();
      }
      this.modal.showLoginMessage();
    }
  }

  public handleUser() {
    const stored = this.storage.getData('UserId') as AuthorizationData | null;
    if (stored) {
      const refreshTokenExpires = stored.tokenExpires
      + (REFRESHTOKEN_LIFETIME_IN_HOURS - TOKEN_LIFETIME_IN_HOURS) * 60 * 60 * 1000;
      if (refreshTokenExpires > Date.now()) this.userUI.authorise(stored);
      else { this.handleUnLogin(); }
    }
  }

  public async handleRegistartion(
    name: string,
    email: string,
    password: string,
    errorMessage: HTMLElement,
  ) {
    const object: UserCreationData = { name, email, password };
    const regResponse = await this.api.createUser(object);
    if (typeof regResponse === 'object') {
      this.modal.showMessage(`Успешная регистрация! Добро пожаловать, ${name}`);
      const obj: Pick<UserCreationData, 'email' | 'password'> = { email, password };
      setTimeout(() => this.makeNewUser(obj), 3000);
    } else {
      // eslint-disable-next-line no-param-reassign
      errorMessage.innerHTML = 'Пользователь с таким e-mail уже существует';
    }
  }

  private async makeNewUser(obj: Pick<UserCreationData, 'email' | 'password'>) {
    const res = await this.api.authorize(obj);
    if (typeof res === 'object') {
      this.modal.exitModal();
      this.storage.setData('UserId', res);
      this.userUI.authorise(res);
      if (window.location.href.match(/\/book$/)) {
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
    console.log('sprint2');
    this.sprint = new Sprint('menu');
    this.sprint.renderGame();
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
