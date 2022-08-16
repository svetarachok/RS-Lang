const BASE_LINK = 'http://localhost:8088';

enum Endpoint {
  words = '/words',
  users = '/users',
  signin = '/signin',
}
enum ContentType {
  json = 'application/json',
}

enum HTTPMethod {
  POST = 'POST',
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

interface UserData {
  name: string
  email: string
  password: string
}

interface AuthorizationData {
  message: string,
  token: string,
  refreshToken: string,
  userId: string,
  name: string,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface NewUser extends Pick<UserData, 'name' | 'email'> {
  id: string,
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
  public async getWords(queryParam?: { group: string, page: string }): Promise<Word[]> {
    const url: URL = makeUrl(BASE_LINK, Endpoint.words, queryParam);
    const response = await fetch(url);
    return response.json();
  }

  public async getWordById(id: string): Promise<Word> {
    const url: URL = makeUrl(BASE_LINK, Endpoint.words);
    const response = await fetch(`${url}/${id}`);
    return response.json();
  }

  public async createUser(userData: UserData): Promise<NewUser | string> {
    const response = await fetch(makeUrl(BASE_LINK, Endpoint.users), {
      method: HTTPMethod.POST,
      headers: {
        'Content-Type': ContentType.json,
      },
      body: JSON.stringify(userData),
    });

    if (response.status === 417) {
      return response.text();
    }
    return response.json();
  }

  public async authorize(authData: Pick<UserData, 'email' | 'password'>): Promise<AuthorizationData | string> {
    const response = await fetch(makeUrl(BASE_LINK, Endpoint.signin), {
      method: HTTPMethod.POST,
      headers: {
        'Content-Type': ContentType.json,
      },
      body: JSON.stringify(authData),
    });

    if (response.status === 403) {
      return 'Incorrect e-mail or password';
    }
    return response.json();
  }
}
