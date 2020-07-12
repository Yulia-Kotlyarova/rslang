import arrayShuffle from 'lodash/_arrayShuffle';
import MessageModal from '../../modules/MessageModal';
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
    this.startCountdownContainer = document.querySelector('.savannah__game__start-countdown');
    this.wordsCounterContainer = document.querySelector('.savannah__game__words-counter');
  }

  async startGame(isPlayAgain) {
    clearInterval(this.savannahState.timerId);
    const language = localStorage.getItem('app-language');
    this.wordsCounterContainer.innerText = '';
    this.startNewRound.returnActiveWordPosition();
    this.startNewRound.answersArea.innerHTML = '';
    try {
      if (!this.savannahState.userWords && !isPlayAgain) {
        this.savannahState.wordsCollection = await this.getWordsCollection();
      }
      this.savannahState.wordsOrder = StartNewGame.setWordsOrder();
      this.savannahState.activeWord = 0;
      this.savannahState.wordAndAnswers.length = 0;
      this.savannahState.answeredCorrect.length = 0;
      this.savannahState.answeredWrong.length = 0;
      this.savannahState.wordAndAnswers = this.combineWordsAndAnswers();
      this.heartContainer.innerHTML = heartFill.repeat(5);
      const currentLevelContainer = document.querySelector('.navigation__position .current-level').lastChild;
      const currentRoundContainer = document.querySelector('.navigation__position .current-round').lastChild;
      if (this.savannahState.userWords) {
        currentLevelContainer.innerText = this.savannahState.userWordsLevel + 1;
        currentRoundContainer.innerText = 'user words';
      } else {
        currentLevelContainer.innerText = this.savannahState.currentLevel + 1;
        currentRoundContainer.innerText = this.savannahState.currentRound + 1;
      }
      this.startCountdownContainer.classList.remove('hidden');
      setTimeout(() => {
        this.startCountdownContainer.innerText = '3';
      }, 100);
      setTimeout(() => {
        this.startCountdownContainer.innerText = '2';
      }, 1100);
      setTimeout(() => {
        this.startCountdownContainer.innerText = '1';
      }, 2100);
      setTimeout(() => {
        this.startCountdownContainer.innerText = '';
        this.startCountdownContainer.classList.add('hidden');
        this.startNewRound.startRound();
      }, 3100);
    } catch (error) {
      const modalError = document.querySelector('.fetchWordsCollectionError');
      if (!modalError) {
        const messageModal = new MessageModal();
        messageModal.appendSelf('fetchWordsCollectionError');
      }
      if (language === 'ru') {
        MessageModal.showModal('Что-то пошло не так. Попробуйте снова.', null, 'fetchWordsCollectionError');
      } else {
        MessageModal.showModal('Sorry, something went wrong. Please try again.', null, 'fetchWordsCollectionError');
      }
    }
  }

  async getWordsCollection() {
    const level = this.savannahState.currentLevel;
    const round = this.savannahState.currentRound;
    const url = `https://afternoon-falls-25894.herokuapp.com/words?group=${level}&page=${round}`;
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
