const BASE_LINK = 'http://localhost:8088';

enum Endpoint {
  words = '/words',
}

interface Word {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  wordTranslate: string,
  textMeaningTranslate: string,
  textExampleTranslate: string,
}

const generateQueryString = (queryParam: Record<string, string>): string => `?${Object.keys(queryParam)
  .map((key: string) => `${key}=${queryParam[key]}`)
  .join('&')}`;

const makeUrl = (
  base: string,
  endpoint: Endpoint,
  queryParam?: Record<string, string>,
): URL => {
  const paramString = queryParam ? generateQueryString(queryParam) : '';
  return new URL(`${endpoint}${paramString}`, base);
};

export default class Api {
  async getWords(queryParam?: { group: string, page: string }): Promise<Word[]> {
    const url: URL = makeUrl(BASE_LINK, Endpoint.words, queryParam);
    const response = await fetch(url);
    return response.json();
  }

  async getWordById(id: string): Promise<Word> {
    const url: URL = makeUrl(BASE_LINK, Endpoint.words);
    const response = await fetch(`${url}/${id}`);
    return response.json();
  }
}
