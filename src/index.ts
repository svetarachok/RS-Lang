import { TextBook } from './components/textBook/TextBook';
import Router from './components/Model/Router';
import './global.scss';

console.log('Lets go');

const router = new Router({
  mode: 'hash',
  root: '/',
});

const textBook = new TextBook(7);

router
  .add('book', () => {
    console.log('Render book page');
    textBook.startTextBook();
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
