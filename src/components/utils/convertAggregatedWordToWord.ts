/* eslint-disable no-underscore-dangle */
import { UserAggregatedWord, Word } from '../types/interfaces';

export const convertAggregatedWordToWord = (aggrWord: UserAggregatedWord): Word => ({
  id: aggrWord._id,
  group: aggrWord.group,
  page: aggrWord.page,
  word: aggrWord.word,
  image: aggrWord.image,
  audio: aggrWord.audio,
  audioMeaning: aggrWord.audioMeaning,
  audioExample: aggrWord.audioExample,
  textMeaning: aggrWord.textMeaning,
  textExample: aggrWord.textExample,
  transcription: aggrWord.transcription,
  wordTranslate: aggrWord.wordTranslate,
  textMeaningTranslate: aggrWord.textMeaningTranslate,
  textExampleTranslate: aggrWord.textExampleTranslate,
});
