import { AudioCall } from './components/audiocall/audioCall';
import Router from './components/Model/Router';
import './global.scss';

console.log('Lets go');

const router = new Router({
  mode: 'hash',
  root: '/',
});

router
  .add('book', () => {
    console.log('Render book page');
  })
  .add('audiocall', () => {
    console.log('Render audiocall page');
    new AudioCall().start();
  })
  .add('sprint', () => {
    console.log('Render sprint page');
  })
  .add('statistic', () => {
    console.log('Render statistic page');
  });
