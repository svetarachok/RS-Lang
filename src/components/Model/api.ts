import { storage } from '../Storage/Storage';
import { Endpoint, HTTPMethod, ContentType } from '../types/enums';
import {
  Word, User, UserCreationData, AuthorizationData,
  UserWord, UserAggregatedWordsResult,
  UserAggregatedWord,
  Statistic, StatisticResponse, DailyStatObj, FetchOptions,
} from '../types/interfaces';
import { BASE_LINK, TOKEN_LIFETIME_IN_HOURS } from '../utils/constants';
import { generateQueryString, makeUrl } from '../utils/functions';
import { makeDailyStat } from '../utils/makeDailyStatObject';

export class Api {
  storage: typeof storage;

  constructor() {
    this.storage = storage;
  }

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

    if (!response.ok) return response.text();
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
    const data = await response.json();
    data.tokenExpires = Date.now() + TOKEN_LIFETIME_IN_HOURS * 60 * 60 * 1000;
    return data;
  }

  // need tocken check
  public async getUserById(authData: AuthorizationData): Promise<User | string> {
    const response = await fetch(`${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}`, {
      method: HTTPMethod.GET,
      headers: {
        Authorization: `Bearer ${authData.token}`,
        Accept: ContentType.json,
      },
    });

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

  // need tocken check
  public async setUserWord(
    authData: AuthorizationData,
    wordId:string,
    userWord: Omit<UserWord, 'id' | 'wordId'>,
  ):
    Promise<UserWord | string> {
    const response = await this.fetchWithAuth(authData, `${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.words}/${wordId}`, {
      method: HTTPMethod.POST,
      headers: {
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

  public async getUserWords(authData: AuthorizationData):
  Promise<Required<UserWord>[] | string> {
    const response = await this.fetchWithAuth(authData, `${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.words}`, {
      method: HTTPMethod.GET,
    });

    if (!response.ok) return response.text();
    return response.json();
  }

  public async getUserWordById(authData: AuthorizationData, wordId:string):
  Promise<Required<UserWord> | string> {
    const response = await this.fetchWithAuth(authData, `${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.words}/${wordId}`, {
      method: HTTPMethod.GET,
    });
    if (response.status === 400) {
      const errorMessage = (await response.json()).error.errors[0].message as string;
      return errorMessage;
    }
    if (!response.ok) return response.text();
    return response.json();
  }

  public async changeUserWord(
    authData: AuthorizationData,
    wordId:string,
    userWord: Omit<UserWord, 'id' | 'wordId'>,
  ):
    Promise<UserWord | string> {
    const response = await this.fetchWithAuth(authData, `${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.words}/${wordId}`, {
      method: HTTPMethod.PUT,
      headers: {
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

  public async deleteUserWord(authData: AuthorizationData, wordId:string):
  Promise<boolean> {
    const response = await this.fetchWithAuth(authData, `${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.words}/${wordId}`, {
      method: HTTPMethod.DELETE,
    });
    return response.ok;
  }

  public async getAggregatedUserWords(
    authData: AuthorizationData,
    queryParam: { group?: string, page?: string, wordsPerPage?: string },
    filterStr?: string,
  ):
    Promise<UserAggregatedWord[] | string> {
    const paramString = filterStr
      ? generateQueryString({ ...queryParam, ...{ filter: filterStr } })
      : generateQueryString(queryParam);
    const response = await this.fetchWithAuth(authData, `${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.aggregatedWords}${paramString}`, {
      method: HTTPMethod.GET,
    });
    if (!response.ok) return response.text();
    const data: UserAggregatedWordsResult[] = await response.json();

    return data[0].paginatedResults;
  }

  public async getTotalUserWords(
    authData: AuthorizationData,
    filterStr: string,
    queryParam?: { group: string, page?: string, wordsPerPage?: string },
  ):
    Promise<number | string> {
    const paramString = queryParam
      ? generateQueryString({ ...queryParam, ...{ filter: filterStr } })
      : generateQueryString({ filter: filterStr });
    const response = await this.fetchWithAuth(authData, `${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.aggregatedWords}${paramString}`, {
      method: HTTPMethod.GET,
    });
    if (!response.ok) return response.text();
    const data: UserAggregatedWordsResult[] = await response.json();
    if (data[0].totalCount.length) {
      return data[0].totalCount[0].count;
    } return 'В вашем учебнике нет Сложных слов';
  }

  public async getAggregatedUserWord(authData: AuthorizationData, wordId:string):
  Promise<UserAggregatedWord | string> {
    const response = await this.fetchWithAuth(authData, `${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.aggregatedWords}/${wordId}`, {
      method: HTTPMethod.GET,
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
    authData: AuthorizationData,
    statistic: Statistic,
  ):
    Promise<StatisticResponse | string> {
    const response = await this.fetchWithAuth(authData, `${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.statistics}`, {
      method: HTTPMethod.PUT,
      headers: {
        'Content-Type': ContentType.json,
      },
      body: JSON.stringify(statistic),
    });

    const data = await response.json();
    if (!response.ok) return response.text();

    return data;
  }

  public async getStatistic(authData: AuthorizationData):
  Promise<StatisticResponse | string | null> {
    const response = await this.fetchWithAuth(authData, `${makeUrl(BASE_LINK, Endpoint.users)}/${authData.userId}${Endpoint.statistics}`, {
      method: HTTPMethod.GET,
    });

    if (response.status === 404) return null;
    if (!response.ok) return response.text();
    const data = await response.json();
    return data;
  }

  public async getStatDataForRender() {
    const userData = this.storage.getUserIdData();
    let dailyStat: [string, DailyStatObj][] = [];
    const statData: StatisticResponse = await this.getStatistic(userData) as StatisticResponse;
    if (statData) {
      dailyStat = makeDailyStat(statData);
      return dailyStat;
    } dailyStat = [];
    return dailyStat;
  }

  private async fetchWithAuth(authData: AuthorizationData, url: string, options: FetchOptions) {
    let token;
    if (authData.tokenExpires > Date.now()) {
      token = authData.token;
    } else {
      const newUserData = authData;
      const response = await this.getNewUserToken(authData);
      if (typeof response === 'object') {
        newUserData.token = response.token;
        newUserData.refreshToken = response.refreshToken;
        newUserData.tokenExpires = Date.now() + TOKEN_LIFETIME_IN_HOURS * 60 * 60 * 1000;

        storage.setData('UserId', newUserData);
        token = newUserData.token;
      }
    }
    const fetchOptions = options;
    fetchOptions.headers = options.headers || {};
    fetchOptions.headers.Authorization = `Bearer ${token}`;
    return fetch(url, fetchOptions);
  }
}

export const api: Api = new Api();

// 401 Unauthorized не тот токен
// 403 Forbidden не тот юзерайди
// 404 у юзера нет статистики Couldn't find a(an) statistic with: "userId: 630a8bf986a1e800749e9556"
