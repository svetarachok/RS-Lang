import createNode from '../utils/createNode';
import { Form } from './Form';

export class LoginForm extends Form {
  email: HTMLInputElement;

  password: HTMLInputElement;

  formName: string;

  btnName: string;

  emailWrapper: HTMLElement;

  passWrapper: HTMLElement;

  constructor(formName: string, btnName: string) {
    super(formName, btnName);
    this.formName = formName;
    this.btnName = btnName;
    this.email = createNode({ tag: 'input', classes: ['email-input'], atributesAdnValues: [['type', 'email'], ['placeholder', 'Your e-mail'], ['data-name', 'e-mail']] }) as HTMLInputElement;
    this.password = createNode({ tag: 'input', classes: ['password-input'], atributesAdnValues: [['type', 'password'], ['placeholder', 'Password'], ['autocomplete', 'on'], ['data-name', 'пароль']] }) as HTMLInputElement;
    this.emailWrapper = super.createInput(this.email);
    this.passWrapper = super.createInput(this.password);
  }

  public renderForm(): HTMLDivElement {
    const formWrapper = super.renderForm();
    this.form.prepend(this.emailWrapper, this.passWrapper);
    return formWrapper;
  }

  public listenForm(callback: (mail: string, pass: string) => void) {
    this.submitBtn.addEventListener('click', () => {
      const validate = super.validateForm(this.form);
      if (validate) {
        callback(this.email.value, this.password.value);
      }
    });
  }
}
