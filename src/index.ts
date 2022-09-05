import { Controller } from './components/controller/Controller';
import './global.scss';

const controller = new Controller();

if (document.location.hash === '') {
  document.location.href += '#/';
  controller.mainPage.renderMain();
}
controller.initRouter();
controller.initApp();
