import { Endpoint, HTTPMethod, ContentType } from '../types/enums';
import {
  Word, User, UserCreationData, AuthorizationData,
} from '../types/interfaces';
import { BASE_LINK } from '../utils/constants';
import { makeUrl } from '../utils/functions';

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

  public async createUser(userCreationData: UserCreationData): Promise<User | string> {
    const response = await fetch(makeUrl(BASE_LINK, Endpoint.users), {
      method: HTTPMethod.POST,
      headers: {
        'Content-Type': ContentType.json,
      },
      body: JSON.stringify(userCreationData),
    });

    if (response.status === 417) return response.text();
    return response.json();
  }

  public async authorize(authData: Pick<UserCreationData, 'email' | 'password'>): Promise<AuthorizationData | string> {
    const response = await fetch(makeUrl(BASE_LINK, Endpoint.signin), {
      method: HTTPMethod.POST,
      headers: {
        'Content-Type': ContentType.json,
      },
      body: JSON.stringify(authData),
    });

    if (response.status === 404) return 'Incorrect e-mail or password';
    return response.json();
  }

  public async getUserById(authData: Pick<AuthorizationData, 'token' | 'userId'>): Promise<User | string> {
    const response = await fetch(`${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}`, {
      method: HTTPMethod.GET,
      headers: {
        Authorization: `Bearer ${authData.token}`,
        Accept: ContentType.json,
      },
    });
    console.log(response);

    if (response.status === 403) return 'UserId not found';
    if (response.status === 401) return 'Access token is missing or invalid';
    return response.json();
  }

  public async getNewUserToken(authData: Pick<AuthorizationData, 'refreshToken' | 'userId'>):
  Promise<Pick<AuthorizationData, 'token' | 'refreshToken'> | string> {
    const response = await fetch(`${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.tokens}`, {
      method: HTTPMethod.GET,
      headers: {
        Authorization: `Bearer ${authData.refreshToken}`,
      },
    });

    if (response.status === 403 || response.status === 401) return 'Access token is missing, expired or invalid';
    return response.json();
  }
}
