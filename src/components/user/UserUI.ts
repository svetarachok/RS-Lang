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
    this.headerEnterBtn = createNode({
      tag: 'a', classes: ['enter-cabinet-link'], atributesAdnValues: [['href', '/user'], ['data-navigo', 'true']], inner: 'Enter Cabinet',
    }) as HTMLButtonElement;
    this.userPage = createNode({ tag: 'div', classes: ['user-page'] });
    this.name = createNode({ tag: 'h2', classes: ['user-name'] });
    this.email = createNode({ tag: 'p', classes: ['user-name'] });
    this.exitBtn = createNode({ tag: 'button', classes: ['btn', 'exit-cabinet-btn'], inner: 'Exit cabinet' }) as HTMLButtonElement;
    this.statistic = createNode({ tag: 'div', classes: ['statistic-block'] });
  }

  public authorise(res: AuthorizationData) {
    this.name.innerHTML = res.name;
    REGISTER_BTN.style.display = 'none';
    LOGIN_BTN.style.display = 'none';
    USER_AUTH_WRAPPER.append(this.headerEnterBtn);
    this.headerEnterBtn.style.display = 'flex';
    return USER_AUTH_WRAPPER;
  }

  public unAuthorize(hanlder: () => void) {
    this.exitBtn.addEventListener('click', () => {
      REGISTER_BTN.style.display = 'block';
      LOGIN_BTN.style.display = 'block';
      this.headerEnterBtn.style.display = 'none';
      hanlder();
    });
  }

  public renderUserPage() {
    console.log('User Page Rendered');
    const container: HTMLElement = document.querySelector('.main') as HTMLElement;
    container.innerHTML = '';
    this.userPage.innerHTML = '';
    const sidebar = createNode({ tag: 'aside', classes: ['aside', 'user-sidebar'] });
    // this.email.innerHTML = email;
    sidebar.append(this.name, this.email, this.exitBtn);
    const statistic = this.renderStatisticBlock();
    this.userPage.append(sidebar, statistic);
    container.append(this.userPage);
    return container;
  }

  public renderStatisticBlock() {
    this.statistic.innerHTML = '';
    const h = createNode({ tag: 'h1', classes: ['statistic-header'], inner: 'Here gonna be staicstic' });
    this.statistic.append(h);
    console.log('statistic rendered', h);
    return this.statistic;
  }
}
