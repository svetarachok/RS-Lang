export const BASE_LINK: string = 'http://localhost:8088';
export const APP_LINK: string = 'http://localhost:8000';
export const TOKEN_LIFETIME_IN_HOURS: number = 3;
export const REFRESHTOKEN_LIFETIME_IN_HOURS: number = 4;
export const LEVELS_OF_TEXTBOOK: number = 7;
export const MAX_PAGE_NUMBER: number = 30;
export const WORDS_PER_PAGE: number = 20;

// Header Auth buttons and div
export const REGISTER_BTN: HTMLButtonElement = document.getElementById('register-btn') as HTMLButtonElement;
export const LOGIN_BTN: HTMLButtonElement = document.getElementById('login-btn') as HTMLButtonElement;
export const USER_ICON: HTMLElement = document.getElementById('user-icon') as HTMLElement;
export const USER_AUTH_WRAPPER: HTMLElement = document.querySelector('.auth') as HTMLElement;

// Statistic data
export const WORDS_DATA_TEXT: string[] = ['новые слова', 'изученные слова', 'правильные ответы'];
export const GAMES_DATA_TEXT: string[] = ['новые слова', 'правильные ответы', 'самая длинная серия'];

// Forms validation
export const EMAIL_REGEX: RegExp = /^[A-Za-z0-9_!#$%&'*+\\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm;
