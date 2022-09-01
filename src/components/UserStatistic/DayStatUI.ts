import { DailyStatObj } from '../types/interfaces';
import createNode from '../utils/createNode';
import { findCorrectAnswPercent } from '../utils/findCorrectAnswersPercent';
import { WORDS_DATA_TEXT, GAMES_DATA_TEXT } from '../utils/constants';

export class DayStatUI {
  obj: DailyStatObj;

  date: string;

  wrapper: HTMLElement;

  constructor(data: [string, DailyStatObj]) {
    this.wrapper = createNode({ tag: 'div', classes: ['wrapper_day-stat'] });
    [this.date, this.obj] = data;
  }

  public drawFirstDayStat() {
    const dayWrap = createNode({ tag: 'div', classes: ['todaystat-wrapper'] });
    const textRow = createNode({ tag: 'div', classes: ['date-row'] });
    const firstRow = createNode({ tag: 'div', classes: ['data-wrapper-row1'] });
    const secondRow = createNode({ tag: 'div', classes: ['data-wrapper-row2'] });
    const dayText = createNode({ tag: 'p', classes: ['first-day-text'], inner: 'Последний раз вы занимались' });
    const dayData = createNode({ tag: 'p', classes: ['first-day-date'] });
    const today = new Date();
    if (this.date === today.toLocaleDateString()) {
      dayData.innerHTML = 'Сегодня';
    } else {
      dayData.innerHTML = `${this.date}`;
    }
    const corrWordAnsw = findCorrectAnswPercent(
      this.obj.words.correctAnswers,
      this.obj.words.incorrectAnswers,
    );
    const corrAudioAnsw = findCorrectAnswPercent(
      this.obj.games.audiocall.correctAnswers,
      this.obj.games.audiocall.incorrectAnswers,
    );
    const corrSprintAnsw = findCorrectAnswPercent(
      this.obj.games.sprint.correctAnswers,
      this.obj.games.sprint.incorrectAnswers,
    );
    const wordWrap = this.createColumn('word', 'Слова', WORDS_DATA_TEXT, [this.obj.words.newWords, this.obj.words.learnedWords, corrWordAnsw]);
    const audioWrap = this.createColumn('word', 'Игра Audiocall', GAMES_DATA_TEXT, [this.obj.games.audiocall.newWords, corrAudioAnsw, this.obj.games.audiocall.bestSeries]);
    const sprintWrap = this.createColumn('word', 'Игра Sprint', GAMES_DATA_TEXT, [this.obj.games.sprint.newWords, corrSprintAnsw, this.obj.games.sprint.bestSeries]);
    textRow.append(dayText, dayData);
    firstRow.append(textRow, audioWrap);
    secondRow.append(wordWrap, sprintWrap);
    dayWrap.append(firstRow, secondRow);
    return dayWrap;
  }

  public drawDayStat() {
    const dayWrap = createNode({ tag: 'div', classes: ['daystat-wrapper'] });
    const day = createNode({ tag: 'p', classes: ['date-text'], inner: `${this.date}` });
    const corrWordAnsw = findCorrectAnswPercent(
      this.obj.words.correctAnswers,
      this.obj.words.incorrectAnswers,
    );
    const corrAudioAnsw = findCorrectAnswPercent(
      this.obj.games.audiocall.correctAnswers,
      this.obj.games.audiocall.incorrectAnswers,
    );
    const corrSprintAnsw = findCorrectAnswPercent(
      this.obj.games.sprint.correctAnswers,
      this.obj.games.sprint.incorrectAnswers,
    );
    const wordWrap = this.createColumn('word', 'Слова', WORDS_DATA_TEXT, [this.obj.words.newWords, this.obj.words.learnedWords, corrWordAnsw]);
    const audioWrap = this.createColumn('word', 'Игра Audiocall', GAMES_DATA_TEXT, [this.obj.games.audiocall.newWords, corrAudioAnsw, this.obj.games.audiocall.bestSeries]);
    const sprintWrap = this.createColumn('word', 'Игра Sprint', GAMES_DATA_TEXT, [this.obj.games.sprint.newWords, corrSprintAnsw, this.obj.games.sprint.bestSeries]);
    dayWrap.append(day, wordWrap, audioWrap, sprintWrap);
    return dayWrap;
  }

  private createColumn(
    classData: string,
    inner: string,
    params: string[],
    values: (number | string)[],
  ) {
    const wrap = createNode({ tag: 'div', classes: [`${classData}-wrapper`] });
    const text = createNode({ tag: 'p', classes: [`${classData}-text`], inner: `${inner}` });
    const list = createNode({ tag: 'div', classes: ['stat-data-items'] });
    const listParams: HTMLElement[] = [];
    params.forEach((param: string): void => {
      const paramText = createNode({ tag: 'p', classes: ['stat-data-param'], inner: param });
      listParams.push(paramText);
    });
    const listValues: HTMLElement[] = [];
    values.forEach((value: number | string): void => {
      const valueText: HTMLElement = createNode({ tag: 'p', classes: ['stat-data-value'], inner: `${String(value)}` });
      listValues.push(valueText);
    });

    for (let i = 0; i < params.length; i += 1) {
      const listItem = createNode({ tag: 'div', classes: ['stat-data-item'] });
      listItem.append(listParams[i], listValues[i]);
      list.append(listItem);
    }
    wrap.append(text, list);
    return wrap;
  }
}
