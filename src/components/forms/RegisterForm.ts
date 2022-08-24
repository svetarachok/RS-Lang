import { LoginForm } from './LoginForm';
import createNode from '../utils/createNode';

export class RegisterForm extends LoginForm {
  name: HTMLInputElement;

  constructor(formName: string, btnName: string) {
    super(formName, btnName);
    this.name = createNode({ tag: 'input', classes: ['name-input'], atributesAdnValues: [['type', 'text'], ['placeholder', 'Your name']] }) as HTMLInputElement;
    this.email = createNode({ tag: 'input', classes: ['email-input'], atributesAdnValues: [['type', 'email'], ['placeholder', 'Your e-mail']] }) as HTMLInputElement;
    this.password = createNode({ tag: 'input', classes: ['password-input'], atributesAdnValues: [['type', 'password'], ['placeholder', 'Password'], ['autocomplete', 'off']] }) as HTMLInputElement;
    this.submitBtn = createNode({ tag: 'button', classes: ['btn', 'btn-submit'], inner: 'Register' }) as HTMLButtonElement;
  }

  public renderForm() {
    const formWrapper = super.renderForm();
    this.form.prepend(this.name);
    return formWrapper;
  }

  public listenForm(callback: (name: string, mail: string, pass: string) => void) {
    this.submitBtn.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const name = super.checkInputValue(this.name);
      const email = super.checkInputValue(this.email);
      const password = super.checkInputValue(this.password);
      if (!email && !password && !name) {
        console.log('Fill in the form');
      } else if (!email) {
        console.log('Enter email');
      } else if (!password) {
        console.log('Enter password');
      } else if (!name) {
        console.log('Enter name');
      } else {
        callback(this.name.value, this.email.value, this.password.value);
      }
    });
  }
}
