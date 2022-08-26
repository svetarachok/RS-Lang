import { api } from '../Model/api';
import { storage } from '../Storage/Storage';
import { UserWord } from '../types/interfaces';

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

  private createUserWordByAnswer(correct: boolean): UserWord {
    const newWord: UserWord = {
      difficulty: 'easy',
      optional: {
        learned: false,
        correctAnswers: 0,
        incorrectAnswers: 0,
        correctSeries: 0,
      },
    };
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
      } else if (changedWord.difficulty === 'hard' && changedWord.optional.correctSeries >= 5) {
        changedWord.optional.learned = true;
      }
    } else {
      changedWord.optional.correctSeries = 0;
      changedWord.optional.incorrectAnswers += 1;
      changedWord.optional.learned = false;
    }
    return changedWord;
  }

  public async sendWordOnServer(wordId: string, correct: boolean) {
    if (this.isAuthorized) {
      const userData = this.storage.getUserIdData();
      const userWords = await this.api.getUserWords(userData);
      let isWordInUserWords = false;
      userWords.forEach((word) => {
        if (word.wordId === wordId) {
          isWordInUserWords = true;
        }
      });
      if (isWordInUserWords) {
        const userWord = await this.api.getUserWordById(userData, wordId);
        const changedWord = this.changeUserWordByAnswer(userWord, correct);
        this.api.changeUserWord(userData, wordId, changedWord);
      } else {
        const newUserWord = this.createUserWordByAnswer(correct);
        this.api.setUserWord(userData, wordId, newUserWord);
      }
    }
  }

  public async getUserWords() {
    const userData = this.storage.getUserIdData();
    const userWords = await this.api.getUserWords(userData);
    console.log(userWords);
  }
}
