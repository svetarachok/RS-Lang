import { Controller } from './components/controller/Controller';
import './global.scss';

console.log('Lets go');

const controller = new Controller();

controller.initRouter();
controller.initApp();
