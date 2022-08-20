import { Controller } from './components/controller/Controller';
import Router from './components/Model/Router';
import './global.scss';

console.log('Lets go');

const router = new Router({
  mode: 'hash',
  root: '/',
});

const controller = new Controller();

router
  .add('book', () => {
    console.log('Render book page');
    controller.initTextBook();
  })
  .add('audiocall', () => {
    console.log('Render audiocall page');
  })
  .add('sprint', () => {
    console.log('Render sprint page');
  })
  .add('statistic', () => {
    console.log('Render statistic page');
  });
