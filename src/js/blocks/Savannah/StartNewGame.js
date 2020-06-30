import arrayShuffle from 'lodash/_arrayShuffle';
import { heartFill } from './consts';

export default class StartNewGame {
  constructor(savannahState, startNewRound) {
    this.startNewRound = startNewRound;
    this.activeWord = '';
    this.savannahState = savannahState;
    this.level = 0;
    this.page = 0;
    this.heartFill = heartFill;
    this.heartContainer = document.querySelector('.control__lifes');
  }

  async startGame() {
    this.savannahState.wordsCollection = await this.getWordsCollection();
    this.savannahState.wordsOrder = StartNewGame.setWordsOrder();
    this.savannahState.wordAndAnswers.length = 0;
    this.savannahState.answeredCorrect.length = 0;
    this.savannahState.answeredWrong.length = 0;
    this.savannahState.wordAndAnswers = this.combineWordsAndAnswers();
    this.heartContainer.innerHTML = heartFill.repeat(5);
    this.startNewRound.startRound();
  }

  async getWordsCollection() {
    const level = this.savannahState.currentLevel;
    const page = this.savannahState.currentPage;
    const url = `https://afternoon-falls-25894.herokuapp.com/words?group=${level}&page=${page}`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
  }

  static setWordsOrder() {
    const arr = [...Array(20).keys()];
    return arrayShuffle(arr);
  }

  combineWordsAndAnswers() {
    const randomizingNumber = 4;
    const arrLength = this.savannahState.wordsCollection.length;
    const arr = [];
    for (let i = 0; i < arrLength; i += 1) {
      const x = this.savannahState.wordsOrder[i];
      const word = this.savannahState.wordsCollection[x];
      const answer1 = this.savannahState.wordsCollection[(x + randomizingNumber) % arrLength];
      const answer2 = this.savannahState.wordsCollection[(x + randomizingNumber * 2) % arrLength];
      const answer3 = this.savannahState.wordsCollection[(x + randomizingNumber * 3) % arrLength];
      arr.push([[true, word], [false, answer1], [false, answer2], [false, answer3]]);
    }
    return arr;
  }
}
