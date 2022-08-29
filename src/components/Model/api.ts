import { Endpoint, HTTPMethod, ContentType } from '../types/enums';
import {
  Word, User, UserCreationData, AuthorizationData,
  UserWord, UserAggregatedWordsResult, UserAggregatedWord, Statistic, StatisticResponse,
} from '../types/interfaces';
import { BASE_LINK } from '../utils/constants';
import { generateQueryString, makeUrl } from '../utils/functions';

export class Api {
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

  public async setUserWord(
    authData: Pick<AuthorizationData, 'token' | 'userId'>,
    wordId:string,
    userWord: Omit<UserWord, 'id' | 'wordId'>,
  ):
    Promise<UserWord | string> {
    const response = await fetch(`${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.words}/${wordId}`, {
      method: HTTPMethod.POST,
      headers: {
        Authorization: `Bearer ${authData.token}`,
        'Content-Type': ContentType.json,
      },
      body: JSON.stringify(userWord),
    });

    if (response.status === 400) {
      const errorMessage = (await response.json()).error.errors[0].message as string;
      return errorMessage;
    }
    if (!response.ok) return response.text();

    return response.json();
  }

  public async getUserWords(authData: Pick<AuthorizationData, 'token' | 'userId'>):
  Promise<Required<UserWord>[] | string> {
    const response = await fetch(`${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.words}`, {
      method: HTTPMethod.GET,
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });

    if (!response.ok) return response.text();
    return response.json();
  }

  public async getUserWordById(authData: Pick<AuthorizationData, 'token' | 'userId'>, wordId:string):
  Promise<Required<UserWord> | string> {
    const response = await fetch(`${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.words}/${wordId}`, {
      method: HTTPMethod.GET,
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });
    if (response.status === 400) {
      const errorMessage = (await response.json()).error.errors[0].message as string;
      return errorMessage;
    }
    if (!response.ok) return response.text();
    return response.json();
  }

  public async changeUserWord(
    authData: Pick<AuthorizationData, 'token' | 'userId'>,
    wordId:string,
    userWord: Omit<UserWord, 'id' | 'wordId'>,
  ):
    Promise<UserWord | string> {
    const response = await fetch(`${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.words}/${wordId}`, {
      method: HTTPMethod.PUT,
      headers: {
        Authorization: `Bearer ${authData.token}`,
        'Content-Type': ContentType.json,
      },
      body: JSON.stringify(userWord),
    });

    if (response.status === 400) {
      const errorMessage = (await response.json()).error.errors[0].message as string;
      return errorMessage;
    }
    if (!response.ok) return response.text();

    return response.json();
  }

  public async deleteUserWord(authData: Pick<AuthorizationData, 'token' | 'userId'>, wordId:string):
  Promise<boolean> {
    const response = await fetch(`${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.words}/${wordId}`, {
      method: HTTPMethod.DELETE,
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });
    return response.ok;
  }

  public async getAggregatedUserWords(
    authData: Pick<AuthorizationData, 'token' | 'userId'>,
    queryParam: { group?: string, page?: string, wordsPerPage?: string },
    filterStr?: string,
  ):
    Promise<UserAggregatedWord[] | string> {
    const paramString = filterStr
      ? generateQueryString({ ...queryParam, ...{ filter: filterStr } })
      : generateQueryString(queryParam);
    const response = await fetch(`${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.aggregatedWords}${paramString}`, {
      method: HTTPMethod.GET,
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });
    if (!response.ok) return response.text();
    const data: UserAggregatedWordsResult[] = await response.json();

    return data[0].paginatedResults;
  }

  public async getTotalUserWords(
    authData: Pick<AuthorizationData, 'token' | 'userId'>,
    filterStr: string,
    queryParam?: { group: string, page?: string, wordsPerPage?: string },
  ):
    Promise<number | string> {
    const paramString = queryParam
      ? generateQueryString({ ...queryParam, ...{ filter: filterStr } })
      : generateQueryString({ filter: filterStr });
    const response = await fetch(`${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.aggregatedWords}${paramString}`, {
      method: HTTPMethod.GET,
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });
    if (!response.ok) return response.text();
    const data: UserAggregatedWordsResult[] = await response.json();
    if (data[0].totalCount.length) {
      return data[0].totalCount[0].count;
    } return 'В вашем учебнике нет Сложных слов';
  }

  public async getAggregatedUserWord(authData: Pick<AuthorizationData, 'token' | 'userId'>, wordId:string):
  Promise<UserAggregatedWord | string> {
    const response = await fetch(`${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.aggregatedWords}/${wordId}`, {
      method: HTTPMethod.GET,
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });
    if (response.status === 400) {
      const errorMessage = (await response.json()).error.errors[0].message as string;
      return errorMessage;
    }
    if (!response.ok) return response.text();
    const data: UserAggregatedWord[] = await response.json();

    return data[0];
  }

  public async setStatistic(
    authData: Pick<AuthorizationData, 'token' | 'userId'>,
    statistic: Statistic,
  ):
    Promise<StatisticResponse | string> {
    const response = await fetch(`${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.statistics}`, {
      method: HTTPMethod.PUT,
      headers: {
        Authorization: `Bearer ${authData.token}`,
        'Content-Type': ContentType.json,
      },
      body: JSON.stringify(statistic),
    });

    const data = await response.json();
    if (!response.ok) return response.text();

    return data;
  }

  public async getStatistic(authData: Pick<AuthorizationData, 'token' | 'userId'>):
  Promise<StatisticResponse | string | null> {
    const response = await fetch(`${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.statistics}`, {
      method: HTTPMethod.GET,
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    });

    if (response.status === 404) return null;
    if (!response.ok) return response.text();
    console.log(response);
    const data = await response.json();
    return data;
  }
}

export const api: Api = new Api();

// 401 Unauthorized не тот токен
// 403 Forbidden не тот юзерайди
// 404 у юзера нет статистики Couldn't find a(an) statistic with: "userId: 630a8bf986a1e800749e9556"
