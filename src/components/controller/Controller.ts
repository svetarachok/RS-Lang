import Navigo from 'navigo';
import { TextBook } from '../textBook/TextBook';
import { Api } from '../Model/api';
import { Modal } from '../utils/Modal';
import { LoginForm } from '../forms/LoginForm';
import { RegisterForm } from '../forms/RegisterForm';
import { REGISTER_BTN, LOGIN_BTN, LEVELS_OF_TEXTBOOK } from '../utils/constants';
import { UserCreationData } from '../types/interfaces';
import { UserUI } from '../user/UserUI';
import { Sprint } from '../sprint/Sprint';

export class Controller {
  router: Navigo;

  api: Api;

  textBook: TextBook;

  sprint: Sprint;

  modal: Modal;

  loginForm: LoginForm;

  registerForm: RegisterForm;

  userUI: UserUI;

  constructor() {
    this.router = new Navigo('/', { hash: true });
    this.api = new Api();
    this.textBook = new TextBook(LEVELS_OF_TEXTBOOK);
    this.sprint = new Sprint();
    this.modal = new Modal();
    this.loginForm = new LoginForm('login', 'Login');
    this.registerForm = new RegisterForm('register', 'Register');
    this.userUI = new UserUI();
    this.initUserForms();
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
      .on('/user', () => {
        console.log('Render user page');
        this.userUI.renderUserPage();
      })
      .resolve();
  }

  public async initTextBook() {
    const data = await this.api.getWords({ group: '0', page: '0' });
    this.handleTextBoookPageUpdate = this.handleTextBoookPageUpdate.bind(this);
    this.textBook.startTextBook(data);
    this.textBook.listenLevels(this.handleTextBoookPageUpdate);
    this.textBook.listenPagination(this.handleTextBoookPageUpdate);
  }

  public async handleTextBoookPageUpdate(groupStr: string, pageStr: string) {
    const data = await this.api.getWords({ group: groupStr, page: pageStr });
    this.textBook.updateCards(data);
    return data;
  }

  public initUserForms() {
    this.startUserForms();
    this.loginForm.listenForm(this.handleLogin.bind(this));
    this.registerForm.listenForm(this.handleRegistartion.bind(this));
  }

  private startUserForms() {
    const loginFormHTML = this.loginForm.renderForm();
    const regFormHTML = this.registerForm.renderForm();
    REGISTER_BTN.addEventListener('click', () => this.modal.renderModal(regFormHTML));
    LOGIN_BTN.addEventListener('click', () => this.modal.renderModal(loginFormHTML));
  }

  public async handleLogin(email: string, password: string) {
    const object: Pick<UserCreationData, 'email' | 'password'> = { email, password };
    const res = await this.api.authorize(object);
    if (typeof res === 'object') {
      this.modal.overLay.remove();
      document.body.classList.remove('hidden-overflow');
      this.userUI.changeHeaderOnAuthorise(res);
      this.router.updatePageLinks();
    } else {
      // ! Вывести текст ошибки в модалку
      console.log(res);
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

  public initSprint() {
    this.sprint.renderGame();
  }
}
