/* eslint-disable import/no-cycle */
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

const prompts = new Prompts();

export default class StartNewGame {
  constructor() {
    this.url = '';
    this.currentLevelContainer = document.querySelector('.current-level').lastChild;
    this.currentRoundContainer = document.querySelector('.current-round').lastChild;
  }

  static async startGame() {
    try {
      StartNewGame.clearLines();
      StartNewGame.clearGameData();
      StartNewGame.removeLineNumbersShadows();
      StartNewGame.getImageURL();
      await StartNewGame.updateGameData();
      StartNewGame.updatePainting();

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
      MessageModal.showModal('Sorry, something went wrong. Please try again.');
    }
  }

  static getImageURL() {
    const level = gameData.level + 1;
    const page = (`0${gameData.page}`).slice(-2);
    gameData.imageData = paintingsData[`${level}_${page}`];
    this.url = `https://raw.githubusercontent.com/anna234365/RSLang-images/master/images/${level}_${page}.jpg`;
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
