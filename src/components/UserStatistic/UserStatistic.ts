/* eslint-disable no-restricted-syntax */
import { api } from '../Model/api';
import { storage } from '../Storage/Storage';
import { GAME } from '../types/enums';
import {
  AuthorizationData, GameStatistic, Statistic, UserWord, WordsStatistic,
} from '../types/interfaces';

function getEmptyStatObject() {
  const date = (new Date()).toLocaleDateString();
  const statObj: Statistic = {
    learnedWords: 0,
    optional: {
      words: {
        [date]: {
          newWords: 0,
          learnedWords: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
        },
      },
      games: {
        audiocall: {
          [date]: {
            newWords: 0,
            currentSeries: 0,
            bestSeries: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
          },
        },
        sprint: {
          [date]: {
            newWords: 0,
            currentSeries: 0,
            bestSeries: 0,
            correctAnswers: 0,
            incorrectAnswers: 0,
          },
        },
      },
    },
  };
  return statObj;
}

export class UserStatistic {
  private learnedWords: number = 0;

  private words: Record<string, WordsStatistic> = {};

  private games: { audiocall: Record<string, GameStatistic>,
    sprint: Record<string, GameStatistic> } = { audiocall: {}, sprint: {} };

  private isWordNew: boolean;

  private gameNames: GAME[] = [GAME.AUDIOCALL, GAME.SPRINT];

  constructor(
    private userData: AuthorizationData,
    private currentGame: GAME,
    private isCorrect: boolean,
    userWord: string | Required<UserWord>,
  ) {
    this.userData = userData;
    this.currentGame = currentGame;
    this.isCorrect = isCorrect;
    this.isWordNew = typeof userWord === 'string';
  }

  static async increaseLearnedWordsCount() {
    const userData = storage.getUserIdData();
    const statisticObj = await api.getStatistic(userData);
    const date = (new Date()).toLocaleDateString();
    if (statisticObj !== null && typeof statisticObj === 'object') {
      statisticObj.learnedWords += 1;
      if (!statisticObj.optional.words[date]) {
        const emptyObject = getEmptyStatObject();
        statisticObj.optional.words[date] = emptyObject.optional.words[date];
        statisticObj.optional.games.audiocall[date] = emptyObject.optional.games.audiocall[date];
        statisticObj.optional.games.sprint[date] = emptyObject.optional.games.sprint[date];
      }
      statisticObj.optional.words[date].learnedWords += 1;
      const statistic: Statistic = {
        learnedWords: statisticObj.learnedWords,
        optional: statisticObj.optional,
      };
      api.setStatistic(userData, statistic);
      // return
    } else if (statisticObj === null) {
      const statistic: Statistic = getEmptyStatObject();
      statistic.learnedWords += 1;
      statistic.optional.words[date].learnedWords += 1;
      api.setStatistic(userData, statistic);
    }
  }

  static async decreaseLearnedWordsCount() {
    const userData = storage.getUserIdData();
    const statisticObj = await api.getStatistic(userData);
    const date = (new Date()).toLocaleDateString();
    if (statisticObj !== null && typeof statisticObj === 'object') {
      if (statisticObj.learnedWords <= 0) return;
      statisticObj.learnedWords -= 1;
      statisticObj.optional.words[date].learnedWords -= 1;
      const statistic: Statistic = {
        learnedWords: statisticObj.learnedWords,
        optional: statisticObj.optional,
      };
      api.setStatistic(userData, statistic);
    } else if (statisticObj === null) {
      api.setStatistic(userData, getEmptyStatObject());
    }
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
    const gameStatistic = this.games[this.currentGame][date];
    if (this.isWordNew) gameStatistic.newWords += 1;
    if (this.isCorrect) {
      gameStatistic.correctAnswers += 1;
      gameStatistic.currentSeries += 1;
      if (gameStatistic.currentSeries > gameStatistic.bestSeries) {
        gameStatistic.bestSeries = gameStatistic.currentSeries;
      }
    } else {
      gameStatistic.incorrectAnswers += 1;
      gameStatistic.currentSeries = 0;
    }

    this.sendStatistic();
  }

  sendStatistic() {
    api.setStatistic(
      this.userData,
      {
        learnedWords: this.learnedWords,
        optional: {
          words: this.words,
          games: this.games,
        },
      },
    );
  }

  initDateInWordStatistic(date: string) {
    this.words[date] = {
      newWords: 0,
      learnedWords: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
    };
  }

  initDateInGameStatistic(date: string, game: GAME) {
    this.games[game][date] = {
      newWords: 0,
      currentSeries: 0,
      bestSeries: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
    };
  }
}
