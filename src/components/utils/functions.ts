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

export function makeFirslLetterUpperCase(string: string) {
  const firstLetter = string[0].toUpperCase();
  const rest = string.slice(1).toLowerCase();
  const res = firstLetter + rest;
  return res;
}
