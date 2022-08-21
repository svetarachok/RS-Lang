import { AuthorizationData } from '../types/interfaces';
import { REGISTER_BTN, LOGIN_BTN, USER_AUTH_WRAPPER } from '../utils/constants';
import createNode from '../utils/createNode';

export class UserUI {
  headerEnterBtn: HTMLButtonElement;

  constructor() {
    this.headerEnterBtn = createNode({ tag: 'button', classes: ['enter-cabinet', 'btn'], inner: 'Enter Cabinet' }) as HTMLButtonElement;
  }

  public renderAuthorisedUI(res: AuthorizationData) {
    const userName: HTMLParagraphElement = createNode({ tag: 'p', classes: ['user-name'], inner: `${res.name}` }) as HTMLParagraphElement;
    REGISTER_BTN.style.display = 'none';
    LOGIN_BTN.style.display = 'none';
    USER_AUTH_WRAPPER.append(this.headerEnterBtn, userName);
    this.listenHeaderButton();
  }

  public listenHeaderButton() {
    this.headerEnterBtn.addEventListener('click', this.renderUserPage.bind(this));
  }

  public renderUserPage() {
    console.log('User Page Rendered');
  }
}
