import Router from './components/Model/Router';
import { Controller } from './components/controller/Controller';
import { Modal } from './components/utils/Modal';
import { REGISTER_BTN, LOGIN_BTN } from './components/utils/constants';
import './global.scss';

console.log('Lets go');

const router = new Router({
  mode: 'hash',
  root: '/',
});

const controller = new Controller();
const modal = new Modal();

const node = document.createElement('div');
node.innerHTML = 'hello';

REGISTER_BTN.addEventListener('click', () => modal.renderModal(node));
LOGIN_BTN.addEventListener('click', () => modal.renderModal(node));

router
  .add('book', () => {
    console.log('Render book page');
    controller.initTextBook();
  })
  .add('audiocall', () => {
    console.log('Render audiocall page');
  })
  .add('sprint', () => {
    controller.initSprint();
  })
  .add('statistic', () => {
    console.log('Render statistic page');
  });
