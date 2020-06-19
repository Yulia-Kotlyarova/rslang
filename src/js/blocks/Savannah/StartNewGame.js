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
    this.defineActiveRound();
    this.savannahState.lastPlayedRound = [this.level, this.page].join('.');
    this.savannahState.currentLevel = this.level;
    this.savannahState.currentPage = this.page;
    this.savannahState.wordsCollection = await this.getWordsCollection();
    this.savannahState.wordsOrder = this.setWordsOrder();
    this.savannahState.wordAndAnswers.length = 0;
    this.savannahState.wordAndAnswers = this.combineWordsAndAnswers();
    this.heartContainer.innerHTML = heartFill.repeat(5);
    this.startNewRound.startRound();
  }

  defineActiveRound() {
    this.level = 0;
    this.page = 0;
    if (this.savannahState.lastPlayedRound !== '') {
      [this.level, this.page] = this.savannahState.lastPlayedRound.split('.');
      if (this.page === 29) {
        if (this.level === 5) {
          this.level = 0;
          this.page = 0;
        } else {
          this.level += 1;
          this.page = 0;
        }
      } else {
        this.page += 1;
      }
    }
    return [this.level, this.page];
  }

  async getWordsCollection() {
    const level = this.savannahState.currentLevel;
    const page = this.savannahState.currentPage;
    const url = `https://afternoon-falls-25894.herokuapp.com/words?group=${level}&page=${page}`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
  }

  setWordsOrder() {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]; // подумать
    const arrLength = this.savannahState.wordsCollection.length;
    for (let i = arrLength - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    return arr;
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
