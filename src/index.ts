import Router from './components/Model/Router';
import { Sprint } from './components/sprint/Sprint';
import './global.scss';

console.log('Lets go');

const router = new Router({
  mode: 'hash',
  root: '/',
});

const sprint = new Sprint();

router
  .add('book', () => {
    console.log('Render book page');
  })
  .add('audiocall', () => {
    console.log('Render audiocall page');
  })
  .add('sprint', () => {
    sprint.penderGame();
  })
  .add('statistic', () => {
    console.log('Render statistic page');
  });
