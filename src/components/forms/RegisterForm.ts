import { Form } from './Form';
import createNode from '../utils/createNode';
import { makeFirslLetterUpperCase } from '../utils/functions';

export class RegisterForm extends Form {
  name: HTMLInputElement;

  nameWrapper: HTMLElement;

  email: HTMLInputElement;

  password: HTMLInputElement;

  emailWrapper: HTMLElement;

  passWrapper: HTMLElement;

  constructor(formName: string, btnName: string) {
    super(formName, btnName);
    this.name = createNode({ tag: 'input', classes: ['name-input'], atributesAdnValues: [['type', 'text'], ['placeholder', 'Ваше имя'], ['data-name', 'Имя'], ['autocomplete', 'off']] }) as HTMLInputElement;
    this.email = createNode({ tag: 'input', classes: ['email-input'], atributesAdnValues: [['type', 'email'], ['placeholder', 'Ваш e-mail'], ['data-name', 'e-mail'], ['autocomplete', 'off']] }) as HTMLInputElement;
    this.password = createNode({ tag: 'input', classes: ['password-input'], atributesAdnValues: [['type', 'password'], ['placeholder', 'Придумайте пароль > 8 символов'], ['autocomplete', 'new-password'], ['data-name', 'Пароль']] }) as HTMLInputElement;
    this.submitBtn = createNode({ tag: 'button', classes: ['btn', 'btn-submit'], inner: 'Зарегистрироваться' }) as HTMLButtonElement;
    this.emailWrapper = super.createInput(this.email);
    this.passWrapper = super.createInput(this.password);
    this.nameWrapper = super.createInput(this.name);
  }

  public renderForm() {
    const formWrapper = super.renderForm();
    this.form.prepend(this.nameWrapper, this.emailWrapper, this.passWrapper);
    return formWrapper;
  }

  public listenForm(callback:
  (name: string, mail: string, pass: string, errorMessage: HTMLElement) => void) {
    this.submitBtn.addEventListener('click', (e: Event) => {
      e.preventDefault();
      this.errorMessage.innerHTML = '';
      const validated = this.validateForm();
      if (validated) {
        const userName = makeFirslLetterUpperCase(this.name.value);
        console.log(userName);
        callback(userName, this.email.value, this.password.value, this.errorMessage);
      }
    });
  }

  public validateForm() {
    const validated = super.validateForm(this.form);
    return validated;
  }
}
