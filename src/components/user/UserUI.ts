import { AuthorizationData } from '../types/interfaces';
import { REGISTER_BTN, LOGIN_BTN, USER_AUTH_WRAPPER } from '../utils/constants';
import createNode from '../utils/createNode';

export class UserUI {
  userPage: HTMLElement;

  headerEnterBtn: HTMLButtonElement;

  name: HTMLElement;

  email: HTMLElement;

  exitBtn: HTMLButtonElement;

  statistic: HTMLElement;

  constructor() {
    this.headerEnterBtn = createNode({ tag: 'button', classes: ['enter-cabinet', 'btn'], inner: 'Enter Cabinet' }) as HTMLButtonElement;
    this.userPage = createNode({ tag: 'div', classes: ['user-page'] });
    this.name = createNode({ tag: 'h2', classes: ['user-name'] });
    this.email = createNode({ tag: 'p', classes: ['user-name'] });
    this.exitBtn = createNode({ tag: 'button', classes: ['btn', 'exit-cabinet-btn'], inner: 'Exit cabinet' }) as HTMLButtonElement;
    this.statistic = createNode({ tag: 'div', classes: ['statistic-block'] });
  }

  public renderAuthorisedUI(res: AuthorizationData) {
    const userName: HTMLParagraphElement = createNode({ tag: 'p', classes: ['user-name'], inner: `${res.name}` }) as HTMLParagraphElement;
    REGISTER_BTN.style.display = 'none';
    LOGIN_BTN.style.display = 'none';
    USER_AUTH_WRAPPER.append(this.headerEnterBtn, userName);
  }

  public listenHeaderButton(name: string, email: string) {
    this.headerEnterBtn.addEventListener('click', () => {
      this.renderUserPage.bind(this);
      this.renderUserPage(name, email);
    });
  }

  public renderUserPage(name: string, email: string) {
    console.log('User Page Rendered');
    const container: HTMLElement = document.querySelector('.main') as HTMLElement;
    container.innerHTML = '';
    const sidebar = this.renderUserInfoSidebar(name, email);
    const statistic = this.renderStatisticBlock();
    this.userPage.append(sidebar, statistic);
    container.append(this.userPage);
    return container;
  }

  private renderUserInfoSidebar(name: string, email: string) {
    const sidebar = createNode({ tag: 'aside', classes: ['aside', 'user-sidebar'] });
    this.email.innerHTML = email;
    this.name.innerHTML = name;
    sidebar.append(this.name, this.email, this.exitBtn);
    return sidebar;
  }

  public renderStatisticBlock() {
    const h = createNode({ tag: 'h1', classes: ['statistic-header'], inner: 'Here gonna be staicstic' });
    this.statistic.append(h);
    console.log('statistic rendered', h);
    return this.statistic;
  }
}
