/* eslint-disable no-restricted-syntax */
import { api } from '../Model/api';
import {
  AuthorizationData, GameStatistic, UserWord, WordsStatistic,
} from '../types/interfaces';

export class UserStatistic {
  private learnedWords: number = 0;

  private words: Record<string, WordsStatistic> = {};

  private games: { audiocall: Record<string, GameStatistic>,
    sprint: Record<string, GameStatistic> } = { audiocall: {}, sprint: {} };

  private isWordNew: boolean;

  private gameNames: ('audiocall' | 'sprint')[] = ['audiocall', 'sprint'];

  constructor(
    private userData: AuthorizationData,
    private currentGame: 'audiocall' | 'sprint',
    private isCorrect: boolean,
    userWord: string | Required<UserWord>,
  ) {
    this.userData = userData;
    this.currentGame = currentGame;
    this.isCorrect = isCorrect;
    this.isWordNew = typeof userWord === 'string';
  }

  public async update() {
    const statisticObj = await api.getStatistic(this.userData);
    if (typeof statisticObj === 'object' && statisticObj !== null) {
      this.learnedWords = statisticObj.learnedWords;
      this.words = statisticObj.optional.words;
      this.games = statisticObj.optional.games;
    }
    this.updateStatistic();
  }

  updateStatistic() {
    const date = (new Date()).toLocaleDateString();
    console.log(date);
    // words
    if (!this.words[date]) this.initDateInWordStatistic(date);
    if (this.isWordNew) this.words[date].newWords += 1;
    if (this.isCorrect) {
      this.words[date].correctAnswers += 1;
    } else { this.words[date].incorrectAnswers += 1; }

    // games
    for (const game of this.gameNames) {
      if (!this.games[game][date]) this.initDateInGameStatistic(date, game);
    }
    console.log(this.games);
    if (this.isWordNew) this.games[this.currentGame][date].newWords += 1;
    if (this.isCorrect) {
      this.games[this.currentGame][date].correctAnswers += 1;
      this.games[this.currentGame][date].series += 1;
    } else {
      this.games[this.currentGame][date].incorrectAnswers += 1;
      this.games[this.currentGame][date].series = 0;
    }

    this.sendStatistic();
  }

  sendStatistic() {
    const test = api.setStatistic(
      this.userData,
      {
        learnedWords: this.learnedWords,
        optional: {
          words: this.words,
          games: this.games,
        },
      },
    );
    console.log(test);
  }

  initDateInWordStatistic(date: string) {
    this.words[date] = {
      newWords: 0,
      learnedWords: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
    };
  }

  initDateInGameStatistic(date: string, game: 'audiocall' | 'sprint') {
    this.games[game][date] = {
      newWords: 0,
      series: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
    };
  }
}
