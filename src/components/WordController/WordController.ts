import { api } from '../Model/api';
import { storage } from '../Storage/Storage';
import { GAME } from '../types/enums';
import { UserAggregatedWord, UserWord } from '../types/interfaces';
import { UserStatistic } from '../UserStatistic/UserStatistic';

export class WordController {
  api: typeof api;

  storage: typeof storage;

  isAuthorized: boolean;

  constructor() {
    this.api = api;
    this.storage = storage;
    this.isAuthorized = this.checkAuthorized();
  }

  private checkAuthorized(): boolean {
    if (localStorage.getItem('UserId') !== null) {
      return true;
    }
    return false;
  }

  private createNewUserWord(): UserWord {
    return {
      difficulty: 'easy',
      optional: {
        learned: false,
        correctAnswers: 0,
        incorrectAnswers: 0,
        correctSeries: 0,
      },
    };
  }

  private createUserWordByAnswer(correct: boolean): Omit<UserWord, 'id' | 'wordId'> {
    const newWord: UserWord = this.createNewUserWord();
    if (correct) {
      newWord.optional.correctAnswers = 1;
      newWord.optional.correctSeries = 1;
    } else {
      newWord.optional.incorrectAnswers = 1;
    }
    return newWord;
  }

  private changeUserWordByAnswer(userWord: UserWord, correct: boolean): UserWord {
    const changedWord = userWord;
    if (correct) {
      changedWord.optional.correctAnswers += 1;
      changedWord.optional.correctSeries += 1;
      if (changedWord.difficulty === 'easy' && changedWord.optional.correctSeries >= 3) {
        changedWord.optional.learned = true;
        UserStatistic.increaseLearnedWordsCount();
      } else if (changedWord.difficulty === 'hard' && changedWord.optional.correctSeries >= 5) {
        changedWord.optional.learned = true;
        changedWord.difficulty = 'easy';
        UserStatistic.increaseLearnedWordsCount();
      }
    } else {
      changedWord.optional.correctSeries = 0;
      changedWord.optional.incorrectAnswers += 1;
      changedWord.optional.learned = false;
    }
    return changedWord;
  }

  public async sendWordOnServer(wordId: string, correct: boolean, game: GAME) {
    if (!this.isAuthorized) return;
    const userData = this.storage.getUserIdData();
    const userWord = await this.api.getUserWordById(userData, wordId);
    new UserStatistic(userData, game, correct, userWord).update();
    if (typeof userWord === 'object') {
      const changedWord = this.changeUserWordByAnswer(userWord, correct);
      this.api.changeUserWord(
        userData,
        wordId,
        { difficulty: changedWord.difficulty, optional: changedWord.optional },
      );
    } else {
      const newUserWord = this.createUserWordByAnswer(correct);
      this.api.setUserWord(userData, wordId, newUserWord);
    }
  }

  public async getUserWords() {
    const userData = this.storage.getUserIdData();
    const userWords = await this.api.getUserWords(userData);
    console.log(userWords);
  }

  public async updateHardWord(difficulty: 'easy' | 'hard', wordId: string) {
    const { userId, token } = this.storage.getData('UserId');
    const word: UserWord = await api.getUserWordById({ userId, token }, wordId) as UserWord;
    if (typeof word === 'object') {
      word.difficulty = difficulty;
      await api.changeUserWord(
        { userId, token },
        wordId,
        { difficulty: word.difficulty, optional: word.optional },
      );
    } else {
      const newWord: UserWord = this.createNewUserWord();
      newWord.difficulty = difficulty;
      await api.setUserWord({ userId, token }, wordId, newWord);
    }
  }

  public async updateLearnedWord(learned: boolean, wordId: string) {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    const data = this.storage.getData('UserId');
    const word = await api.getUserWordById(data, wordId);
    if (typeof word === 'object') {
      word.optional.learned = learned;
      if (!learned) word.optional.correctSeries = 0;
      else { UserStatistic.increaseLearnedWordsCount(); }
      word.difficulty = 'easy';
      await api.changeUserWord(
        data,
        wordId,
        { difficulty: word.difficulty, optional: word.optional },
      );
    } else {
      const newWord: UserWord = this.createNewUserWord();
      newWord.optional.learned = learned;
      if (learned) UserStatistic.increaseLearnedWordsCount();
      await api.setUserWord(data, wordId, newWord);
    }
  }

  public async updateUserWordInfo(wordId: string) {
    const data = this.storage.getData('UserId');
    const word: UserWord = await api.getUserWordById(data, wordId) as UserWord;
    const resp = { difficulty: word.difficulty, learned: word.optional.learned };
    return resp;
  }

  public async getUserBookWords() {
    const logined = this.storage.getData('UserId');
    const totalWords = await this.api.getTotalUserWords(
      { token: logined.token, userId: logined.userId },
      '{"$and":[{"userWord.difficulty":"hard", "userWord.optional.learned":false}]}',
    );
    if (typeof totalWords === 'number') {
      const newData = await this.api.getAggregatedUserWords(
        { token: logined.token, userId: logined.userId },
        { wordsPerPage: String(totalWords) },
        '{"$and":[{"userWord.difficulty":"hard", "userWord.optional.learned":false}]}',
      ) as UserAggregatedWord[];
      return newData;
    } return String(totalWords);
  }
}

export const wordController = new WordController();
