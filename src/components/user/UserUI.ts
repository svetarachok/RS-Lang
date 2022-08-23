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
    this.headerEnterBtn = createNode({ tag: 'p', classes: ['enter-cabinet-link'], inner: '<a href="/user" class="enter-cabinet" data-navigo="true">Enter Cabinet</a>' }) as HTMLButtonElement;
    this.userPage = createNode({ tag: 'div', classes: ['user-page'] });
    this.name = createNode({ tag: 'h2', classes: ['user-name'] });
    this.email = createNode({ tag: 'p', classes: ['user-name'] });
    this.exitBtn = createNode({ tag: 'button', classes: ['btn', 'exit-cabinet-btn'], inner: 'Exit cabinet' }) as HTMLButtonElement;
    this.statistic = createNode({ tag: 'div', classes: ['statistic-block'] });
  }

  public authorise(res: AuthorizationData) {
    if (res) {
      this.name.innerHTML = res.name;
      REGISTER_BTN.style.display = 'none';
      LOGIN_BTN.style.display = 'none';
      USER_AUTH_WRAPPER.append(this.headerEnterBtn);
    } else {
      USER_AUTH_WRAPPER.innerHTML = '';
      REGISTER_BTN.style.display = 'block';
      LOGIN_BTN.style.display = 'block';
      this.headerEnterBtn.style.display = 'none';
    }
  }

  public renderUserPage() {
    console.log('User Page Rendered');
    const container: HTMLElement = document.querySelector('.main') as HTMLElement;
    container.innerHTML = '';
    const sidebar = createNode({ tag: 'aside', classes: ['aside', 'user-sidebar'] });
    // this.email.innerHTML = email;
    sidebar.append(this.name, this.email, this.exitBtn);
    const statistic = this.renderStatisticBlock();
    this.userPage.append(sidebar, statistic);
    container.append(this.userPage);
    return container;
  }

  public renderStatisticBlock() {
    const h = createNode({ tag: 'h1', classes: ['statistic-header'], inner: 'Here gonna be staicstic' });
    this.statistic.append(h);
    console.log('statistic rendered', h);
    return this.statistic;
  }
}
