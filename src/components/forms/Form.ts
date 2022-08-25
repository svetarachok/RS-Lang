import createNode from '../utils/createNode';

export class Form {
  form: HTMLFormElement;

  submitBtn: HTMLButtonElement;

  constructor(formName: string, btnName: string) {
    this.form = createNode({ tag: 'form', classes: ['form'], atributesAdnValues: [['id', `${formName}-form`]] }) as HTMLFormElement;
    this.submitBtn = createNode({ tag: 'button', classes: ['btn', 'btn-submit'], inner: `${btnName}` }) as HTMLButtonElement;
  }

  public renderForm(): HTMLDivElement {
    const formWrapper = createNode({ tag: 'div', classes: ['form-wrapper'] }) as HTMLDivElement;
    this.form.append(this.submitBtn);
    formWrapper.append(this.form);
    return formWrapper;
  }

  public checkInputValue(input: HTMLInputElement): Boolean {
    const { value } = input;
    if (!value) {
      console.log('No value');
      return false;
    } return true;
  }
}
