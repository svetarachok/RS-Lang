import { TextBook } from '../textBook/TextBook';
import { Api } from '../Model/api';
import { Modal } from '../utils/Modal';
import { LoginForm } from '../forms/LoginForm';
import { RegisterForm } from '../forms/RegisterForm';
import { REGISTER_BTN, LOGIN_BTN } from '../utils/constants';
import { AuthorizationData, UserCreationData } from '../types/interfaces';

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
    this.loginForm.listenForm(this.handleLogin.bind(this));
    this.registerForm.listenForm(this.handleRegistartion.bind(this));
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

  public async handleLogin(email: string, password: string) {
    const object: Pick<UserCreationData, 'email' | 'password'> = { email, password };
    const res = await this.api.authorize(object);
    const { message } = res as AuthorizationData;
    if (res) {
      console.log(message);
    } else {
      console.log('User does not exist');
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
}
