export interface Word {
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

export interface UserCreationData {
  name: string
  email: string
  password: string
}

export interface AuthorizationData {
  message: string,
  token: string,
  refreshToken: string,
  userId: string,
  name: string,
}

export interface User extends Pick<UserCreationData, 'name' | 'email'> {
  id: string,
}

export interface RouterOptions {
  mode: 'history' | 'hash',
  root: string,
}

export interface Route {
  path: string,
  cb: Function;
}

export interface GameResult {
  userAuthData?: AuthorizationData,
  correct: Word[],
  incorrect: Word[],
}

export interface RandomPairInSprint {
  word: string,
  wordTranslate: string;
}
