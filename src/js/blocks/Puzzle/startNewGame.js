/* eslint-disable import/no-cycle */
import random from 'lodash/random';
import {
  gameData, painting, paintingInfo, resultsPainting,
  resultsPaintingInfo, puzzleLineNumbers, promptsSettings, backgroundPaiting,
} from './appState';
import { GameArea, gameArea } from './GameArea';
import { createPuzzleElements, calculatePuzzleEementsParameters } from './PuzzleMain';
import { Phrases } from './Phrases';
import paintingsData from './paintingsData';
import Prompts from './Prompts';
import MessageModal from '../../modules/MessageModal';
import Navigation from './Navigation';

const prompts = new Prompts();

export default class StartNewGame {
  constructor() {
    this.url = '';
    this.currentLevelContainer = document.querySelector('.current-level').lastChild;
    this.currentRoundContainer = document.querySelector('.current-round').lastChild;
  }

  static async startGame() {
    const language = localStorage.getItem('app-language');
    try {
      Navigation.updateLines();
      StartNewGame.clearLines();
      StartNewGame.clearGameData();
      StartNewGame.removeLineNumbersShadows();
      StartNewGame.getImageURL();
      await StartNewGame.updateGameData();
      StartNewGame.updatePainting();
      gameData.userWords = false;

      backgroundPaiting.src = this.url;
      backgroundPaiting.onload = function onLoad() {
        const bgWidth = backgroundPaiting.width;
        const bgHeight = backgroundPaiting.height;
        calculatePuzzleEementsParameters(bgWidth, bgHeight);

        setTimeout(() => {
          createPuzzleElements();
          GameArea.shufflePuzzleElements();
          gameArea.addPuzzlesEventListeners();
          GameArea.addDragAndDropListeners();
          if (promptsSettings.painting) {
            Prompts.addPuzzleBackground();
          }
          gameArea.setControlButtons('check');
        }, 500);
      };

      GameArea.activatePuzzleLines();

      if (promptsSettings.autoAudioPlay) {
        Prompts.playPhraseAudio();
      }

      prompts.setTranslationText();
      const currentLevelContainer = document.querySelector('.navigation__position .current-level').lastChild;
      const currentRoundContainer = document.querySelector('.navigation__position .current-round').lastChild;
      currentLevelContainer.innerText = gameData.level + 1;
      currentRoundContainer.innerText = gameData.page + 1;
      const startPage = document.querySelector('.start__page');
      const gameBody = document.querySelector('body');
      const results = document.querySelector('.results');
      startPage.classList.add('display-none');
      results.classList.add('display-none');
      gameBody.classList.remove('scroll-not', 'modal-open');
    } catch (error) {
      const fetchErrorMessage = document.querySelector('.fetchErrorMessage');
      if (!fetchErrorMessage) {
        const messageModal = new MessageModal();
        messageModal.appendSelf('fetchErrorMessage');
      }
      if (language === 'ru') {
        MessageModal.showModal('Что-то пошло не так. Попробуйте снова.', null, 'fetchErrorMessage');
      } else {
        MessageModal.showModal('Sorry, something went wrong. Please try again.', null, 'fetchErrorMessage');
      }
    }
  }

  static async startGameWithUserWords(level, filteredUserWords) {
    const language = localStorage.getItem('app-language');
    try {
      Navigation.updateLines();
      StartNewGame.clearLines();
      StartNewGame.clearGameData();
      StartNewGame.removeLineNumbersShadows();
      const paintingID = StartNewGame.getImageURLforUserWords();

      gameData.wordsCollection = filteredUserWords;
      const newPhrasesData = Phrases.getPhrasesToDisplay(gameData.wordsCollection);
      gameData.phrasesToDisplay = newPhrasesData.phrasesToDisplay;
      gameData.wordsLengthOfAllPhrases = newPhrasesData.wordsLengthOfAllPhrases;
      gameData.userWords = true;
      gameData.userWordsLevel = level;
      StartNewGame.updatePaintingForUserWords(paintingID);

      backgroundPaiting.src = this.url;
      backgroundPaiting.onload = function onLoad() {
        const bgWidth = backgroundPaiting.width;
        const bgHeight = backgroundPaiting.height;
        calculatePuzzleEementsParameters(bgWidth, bgHeight);

        setTimeout(() => {
          createPuzzleElements();
          GameArea.shufflePuzzleElements();
          gameArea.addPuzzlesEventListeners();
          GameArea.addDragAndDropListeners();
          if (promptsSettings.painting) {
            Prompts.addPuzzleBackground();
          }
          gameArea.setControlButtons('check');
        }, 500);
      };

      GameArea.activatePuzzleLines();

      if (promptsSettings.autoAudioPlay) {
        Prompts.playPhraseAudio();
      }

      prompts.setTranslationText();
      const currentLevelContainer = document.querySelector('.navigation__position .current-level').lastChild;
      const currentRoundContainer = document.querySelector('.navigation__position .current-round').lastChild;
      currentLevelContainer.innerText = level;
      currentRoundContainer.innerText = '-';
      const startPage = document.querySelector('.start__page');
      const gameBody = document.querySelector('body');
      const results = document.querySelector('.results');
      startPage.classList.add('display-none');
      results.classList.add('display-none');
      gameBody.classList.remove('scroll-not', 'modal-open');
    } catch (error) {
      const fetchErrorMessage = document.querySelector('.fetchErrorMessage');
      if (!fetchErrorMessage) {
        const messageModal = new MessageModal();
        messageModal.appendSelf('fetchErrorMessage');
      }
      if (language === 'ru') {
        MessageModal.showModal('Что-то пошло не так. Попробуйте снова.', null, 'fetchErrorMessage');
      } else {
        MessageModal.showModal('Sorry, something went wrong. Please try again.', null, 'fetchErrorMessage');
      }
    }
  }

  static getImageURL() {
    const level = gameData.level + 1;
    const page = (`0${gameData.page}`).slice(-2);
    gameData.imageData = paintingsData[`${level}_${page}`];
    this.url = `https://raw.githubusercontent.com/anna234365/RSLang-images/master/images/${level}_${page}.jpg`;
  }

  static getImageURLforUserWords() {
    const level = random(1, 6);
    const page = (`0${random(20)}`).slice(-2);
    gameData.imageData = paintingsData[`${level}_${page}`];
    this.url = `https://raw.githubusercontent.com/anna234365/RSLang-images/master/images/${level}_${page}.jpg`;
    return `${level}_${page}`;
  }

  static clearLines() {
    const puzzleLines = document.querySelectorAll('.puzzle__line');
    const gamePuzzleLines = document.querySelectorAll('.game__line');
    puzzleLines.forEach((line) => {
      const temp = line;
      temp.innerHTML = '';
    });
    gamePuzzleLines.forEach((line) => {
      const temp = line;
      temp.innerHTML = '';
    });
  }

  static clearGameData() {
    gameData.activePhrase = 0;
    gameData.wordsCollection.length = 0;
    gameData.phrasesToDisplay.length = 0;
    gameData.wordsLengthOfAllPhrases.length = 0;
    gameData.gameResultsCorrect.length = 0;
    gameData.gameResultsWrong.length = 0;
  }

  static updatePainting() {
    painting.classList.add('display-none');
    paintingInfo.classList.add('display-none');
    const paintingInfoID = paintingsData[`${gameData.level + 1}_${(`0${gameData.page}`).slice(-2)}`];
    const paintingInfoText = `<b>${paintingInfoID.name}.</b><br>Author: <b>${paintingInfoID.author}</b>. Year: <b>${paintingInfoID.year}</b>`;
    paintingInfo.firstChild.innerHTML = paintingInfoText;
    painting.firstChild.src = this.url;
    resultsPainting.firstChild.href = this.url;
    resultsPainting.firstChild.firstChild.src = this.url;
    resultsPaintingInfo.firstChild.innerHTML = paintingInfoText;
  }

  static updatePaintingForUserWords(paintingID) {
    painting.classList.add('display-none');
    paintingInfo.classList.add('display-none');
    const paintingInfoID = paintingsData[paintingID];
    const paintingInfoText = `<b>${paintingInfoID.name}.</b><br>Author: <b>${paintingInfoID.author}</b>. Year: <b>${paintingInfoID.year}</b>`;
    paintingInfo.firstChild.innerHTML = paintingInfoText;
    painting.firstChild.src = this.url;
    resultsPainting.firstChild.href = this.url;
    resultsPainting.firstChild.firstChild.src = this.url;
    resultsPaintingInfo.firstChild.innerHTML = paintingInfoText;
  }

  static removeLineNumbersShadows() {
    puzzleLineNumbers.forEach((puzzleLineNumber) => {
      puzzleLineNumber.classList.remove('line-number_wrong', 'line-number_correct');
    });
  }

  static async updateGameData() {
    gameData.wordsCollection = await Phrases.fetchWordsCollection();
    const newPhrasesData = Phrases.getPhrasesToDisplay(gameData.wordsCollection);
    gameData.phrasesToDisplay = newPhrasesData.phrasesToDisplay;
    gameData.wordsLengthOfAllPhrases = newPhrasesData.wordsLengthOfAllPhrases;
  }
}
