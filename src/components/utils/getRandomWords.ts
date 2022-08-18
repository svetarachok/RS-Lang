import Api from '../Model/api';
import { randomInteger } from './getRandomInteger';
import { shuffleArray } from './shuffleArray';

const MAX_PAGE_NUMBER = 29;

export async function getRandomWordsByGroup(group: string, count: number) {
  const randomPageNumber = randomInteger(1, MAX_PAGE_NUMBER);
  const api = new Api();
  const words = await api.getWords({ group, page: String(randomPageNumber) });
  const randomWords = shuffleArray(words).slice(0, count);
  return randomWords;
}

export async function getRandomWordByGroup(group: string) {
  return (await getRandomWordsByGroup(group, 1))[0];
}
