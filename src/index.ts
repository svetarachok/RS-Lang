import Router from './components/Model/Router';
import './global.scss';

console.log('Lets go');

const router = new Router({
  mode: 'hash',
  root: '/',
});

router
  .add('main', () => {
    console.log('Render main page');
  })
  .add('games', () => {
    console.log('Render games page');
  })
  .add('words', () => {
    console.log('Render words page');
  });
