import { LoginForm } from './LoginForm';
import createNode from '../utils/createNode';

export class RegisterForm extends LoginForm {
  name: HTMLInputElement;

  constructor(formName: string, btnName: string) {
    super(formName, btnName);
    this.name = createNode({ tag: 'input', classes: ['name-input'], atributesAdnValues: [['type', 'text'], ['placeholder', 'Your name']] }) as HTMLInputElement;
    this.email = createNode({ tag: 'input', classes: ['email-input'], atributesAdnValues: [['type', 'email'], ['placeholder', 'Your e-mail']] }) as HTMLInputElement;
    this.password = createNode({ tag: 'input', classes: ['password-input'], atributesAdnValues: [['type', 'password'], ['placeholder', 'Password']] }) as HTMLInputElement;
    this.submitBtn = createNode({ tag: 'button', classes: ['btn', 'btn-submit'], inner: 'Register' }) as HTMLButtonElement;
  }

  public renderForm() {
    const formWrapper = super.renderForm();
    this.form.prepend(this.name);
    return formWrapper;
  }
}
