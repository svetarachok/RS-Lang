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

export interface UserWord {
  difficulty: 'easy' | 'hard',
  // id === userId
  id?: string,
  wordId?: string,
  optional: {
    learned: boolean;
    correctAnswers: number;
    incorrectAnswers: number;
    correctSeries: number;
  }
}

export interface WordsStatistic {
  newWords: number,
  learnedWords: number,
  correctAnswers: number,
  incorrectAnswers: number,
}

export interface GameStatistic {
  newWords: number,
  series: number,
  correctAnswers: number,
  incorrectAnswers: number,
}

export interface UserAggregatedWord extends Omit<Word, 'id'> {
  _id: string;
  userWord: UserWord,
}

export interface UserAggregatedWordsResult {
  paginatedResults: UserAggregatedWord[],
  totalCount: { count: number }[]
}

export interface Statistic {
  learnedWords: number,
  optional?: {
    words:
    // string - строка в виде даты, например '24.08.2022'
    Record<string, WordsStatistic>
    games: {
      auiocall:
      // string - строка в виде даты, например '24.08.2022'
      Record<string, GameStatistic>
      sprint:
      // string - строка в виде даты, например '24.08.2022'
      Record<string, GameStatistic>
    }
  }
}
export interface StatisticResponse extends Statistic {
  id: string;
}
