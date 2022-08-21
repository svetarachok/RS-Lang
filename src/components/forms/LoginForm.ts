import createNode from '../utils/createNode';
import { Form } from './Form';

export class LoginForm extends Form {
  email: HTMLInputElement;

  password: HTMLInputElement;

  formName: string;

  btnName: string;

  constructor(formName: string, btnName: string) {
    super(formName, btnName);
    this.formName = formName;
    this.btnName = btnName;
    this.email = createNode({ tag: 'input', classes: ['email-input'], atributesAdnValues: [['type', 'email'], ['placeholder', 'Your e-mail']] }) as HTMLInputElement;
    this.password = createNode({ tag: 'input', classes: ['password-input'], atributesAdnValues: [['type', 'password'], ['placeholder', 'Password']] }) as HTMLInputElement;
  }

  public renderForm(): HTMLDivElement {
    const formWrapper = super.renderForm();
    this.form.prepend(this.email, this.password);
    return formWrapper;
  }

  public listenLoginForm(callback: (mail: string, pass: string) => void) {
    this.submitBtn.addEventListener('click', () => {
      const email = super.checkInputValue(this.email);
      const password = super.checkInputValue(this.password);
      if (!email && !password) {
        console.log('Enter email and password');
      } else if (!email) {
        console.log('Enter email');
      } else if (!password) {
        console.log('Enter password');
      } else {
        // eslint-disable-next-line prefer-template
        console.log(this.email.value + ' ' + this.password.value);
        callback(this.email.value, this.password.value);
      }
    });
  }

  // public checkInputValue(input: HTMLInputElement): Boolean {
  //   const data = super.checkInputValue(input);
  //   return data;
  // }
}
