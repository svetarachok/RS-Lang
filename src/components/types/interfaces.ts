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
