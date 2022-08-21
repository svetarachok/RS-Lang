import { TextBook } from '../textBook/TextBook';
import { Api } from '../Model/api';
import { Modal } from '../utils/Modal';
import { LoginForm } from '../forms/LoginForm';
import { RegisterForm } from '../forms/RegisterForm';
import { REGISTER_BTN, LOGIN_BTN } from '../utils/constants';

export class Controller {
  textBook: TextBook;

  api: Api;

  modal: Modal;

  loginForm: LoginForm;

  registerForm: RegisterForm;

  constructor() {
    this.textBook = new TextBook(6);
    this.api = new Api();
    this.modal = new Modal();
    this.loginForm = new LoginForm('login', 'Login');
    this.registerForm = new RegisterForm('register', 'Register');
  }

  public async initTextBook() {
    const data = await this.api.getWords({ group: '0', page: '0' });
    this.handlePageUpdate = this.handlePageUpdate.bind(this);
    this.textBook.startTextBook(data);
    this.textBook.listenLevels(this.handlePageUpdate);
    this.textBook.listenPagination(this.handlePageUpdate);
  }

  public initUserForms() {
    this.activateUserForms();
    this.loginForm.listenLoginForm(this.handleLogin.bind(this));
  }

  public async handlePageUpdate(groupStr: string, pageStr: string) {
    const data = await this.api.getWords({ group: groupStr, page: pageStr });
    this.textBook.updateCards(data);
    return data;
  }

  public activateUserForms() {
    const loginFormHTML = this.loginForm.renderForm();
    const regFormHTML = this.registerForm.renderForm();
    REGISTER_BTN.addEventListener('click', () => this.modal.renderModal(regFormHTML));
    LOGIN_BTN.addEventListener('click', () => this.modal.renderModal(loginFormHTML));
  }

  public handleLogin(email: string, password: string) {
    console.log(email, password);
  }

  public handleRegistartion(name: string, email: string, password: string) {
    console.log(email, name, password);
  }
}
