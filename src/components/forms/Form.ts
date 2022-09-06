import { EMAIL_REGEX } from '../utils/constants';
import createNode from '../utils/createNode';

export class Form {
  form: HTMLFormElement;

  submitBtn: HTMLButtonElement;

  errorMessage: HTMLElement;

  constructor(formName: string, btnName: string) {
    this.form = createNode({ tag: 'form', classes: ['form'], atributesAdnValues: [['id', `${formName}-form`]] }) as HTMLFormElement;
    this.errorMessage = createNode({ tag: 'p', classes: ['error-message'] });
    this.submitBtn = createNode({
      tag: 'button', classes: ['btn', 'btn-submit'], inner: `${btnName}`, atributesAdnValues: [['type', 'button']],
    }) as HTMLButtonElement;
  }

  public renderForm(): HTMLDivElement {
    const formWrapper = createNode({ tag: 'div', classes: ['form-wrapper'] }) as HTMLDivElement;
    this.form.append(this.errorMessage, this.submitBtn);
    formWrapper.append(this.form);
    return formWrapper;
  }

  protected createInput(input: HTMLInputElement) {
    const inputName = input.getAttribute('data-name');
    const inputWrapper = createNode({ tag: 'div', classes: ['input-wrapper'] });
    const error = createNode({ tag: 'div', classes: ['error-in-form'], inner: `Пожалуйста введите ${inputName}` });
    error.style.display = 'none';
    inputWrapper.append(input, error);
    return inputWrapper;
  }

  public checkInputValue(inputWrapper: HTMLElement) {
    const input: HTMLInputElement = inputWrapper.querySelector('input') as HTMLInputElement;
    const error: HTMLElement = inputWrapper.querySelector('.error-in-form') as HTMLElement;
    const value = input.value.trim();
    if (!value) {
      error.style.display = 'block';
      error.innerHTML = 'Заполните поле';
      return false;
    }
    if (input.type === 'password') {
      if (value.length < 8) {
        error.style.display = 'block';
        error.innerHTML = 'Длина пароля должна быть не менее 8 знаков';
        return false;
      }
    }
    if (input.type === 'email') {
      if (!value.match(EMAIL_REGEX)) {
        error.style.display = 'block';
        error.innerHTML = 'Введите правильный email';
        return false;
      }
    }
    error.style.display = 'none';
    return true;
  }

  public validateForm(form: HTMLFormElement) {
    const inputs = [...form.querySelectorAll<HTMLElement>('.input-wrapper')];
    const validated = inputs.every((input) => this.checkInputValue(input));
    if (validated) return true;
    return false;
  }
}
