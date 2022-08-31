import { Endpoint } from '../types/enums';

export const generateQueryString = (queryParam: Record<string, string>): string => `?${Object.keys(queryParam)
  .map((key: string) => `${key}=${queryParam[key]}`)
  .join('&')}`;

export const makeUrl = (
  base: string,
  endpoint: Endpoint,
  queryParam?: Record<string, string>,
): URL => {
  const paramString = queryParam ? generateQueryString(queryParam) : '';
  return new URL(`${endpoint}${paramString}`, base);
};

export function createHTMLElement(
  tag: string,
  classes?: string[],
  atributesAdnValues?: [string, string][],
  content?: string,
): HTMLElement {
  const node = document.createElement(tag);
  if (classes) {
    node.classList.add(...classes);
  }
  if (atributesAdnValues) {
    atributesAdnValues.forEach((atributeAndValue) => {
      node.setAttribute(atributeAndValue[0], atributeAndValue[1]);
    });
  }
  if (content) {
    node.innerHTML = content;
  }
  return node;
}

export function getRandomIntInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function checkPageAllDone() {
  const cards: HTMLElement[] = [...document.querySelectorAll('.card')] as HTMLElement[];
  const pageWrapper: HTMLElement = document.querySelector('.text-book-page') as HTMLElement;
  const pageNumber: HTMLInputElement = document.querySelector('.page-input') as HTMLInputElement;
  const res = cards.every((card) => {
    const hardBtn = card.querySelector('.btn-add');
    const learnBtn = card.querySelector('.btn-learn');
    return (hardBtn?.classList.contains('hard-word-btn') || learnBtn?.classList.contains('learn-word-btn'));
  });
  if (res) {
    pageWrapper.style.border = '3px solid #fddb9f';
    pageNumber.style.backgroundColor = 'lightblue';
  } else {
    pageWrapper.style.border = '3px solid #ffffff';
    pageNumber.style.backgroundColor = 'transparent';
  }
}
