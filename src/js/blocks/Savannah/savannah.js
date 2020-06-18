import '../../../sass/styles.scss';
import { savannahState } from './appState';

import {
  defineActiveRound, getWordsCollection, setWordsOrder, combineWordsAndAnswers,
} from './getActiveWord';

window.onload = async function onload() {
  const [level, page] = defineActiveRound();
  savannahState.lastPlayedRound = [level, page].join('.');
  savannahState.currentLevel = level;
  savannahState.currentPage = page;
  savannahState.wordsCollection = await getWordsCollection();
  savannahState.wordsOrder = setWordsOrder();
  savannahState.wordAndAnswers.length = 0;
  savannahState.wordAndAnswers = combineWordsAndAnswers();
  // console.log(savannahState.wordAndAnswers);
};
