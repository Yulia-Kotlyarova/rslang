/* eslint-disable import/no-cycle */
import {
  gameData, painting, paintingInfo, promptsSettings, levelsAndPages, dragAndDropObjects,
} from './appState';
import StartNewGame from './startNewGame';
import Prompts from './Prompts';
import getTodayShort from '../../helpers';
import Repository from '../../modules/Repository';
import Navigation from './Navigation';

const prompts = new Prompts();
export class GameArea {
  constructor(puzzle, puzzleMatchingPartsWidth) {
    this.gameLine = document.querySelector('.game__game-line');
    this.buttonCheck = document.querySelector('.button__check');
    this.buttonDontKnow = document.querySelector('.button__dontknow');
    this.buttonContinue = document.querySelector('.button__continue');
    this.buttonResults = document.querySelector('.button__results');
    this.puzzle = document.querySelector('.puzzle');
    this.resultsButtonContinue = document.querySelector('.button__continue-results');
    this.results = document.querySelector('.results');
    this.body = document.querySelector('body');

    this.puzzleMatchingPartsWidth = puzzleMatchingPartsWidth;
    this.breakPoints = [];
    this.puzzle = puzzle;
    this.currentPuzzleElement = '';
    this.bindResult = '';
    this.puzzlesEventListener = '';
    this.dragged = '';
    this.targetLine = '';
    this.targetLineChildAfter = '';
    this.targetLineChildBefore = '';
  }

  static shufflePuzzleElements() {
    const puzzleLines = document.querySelectorAll('.game__line');
    puzzleLines.forEach((puzzleLine, index) => {
      const gamePuzzleElements = puzzleLine.querySelectorAll('.puzzle__element');
      const arrayWithIDs = GameArea.shuffleIDs(gamePuzzleElements.length);
      const lineID = `line_${index}`;

      for (let i = 0; i < arrayWithIDs.length; i += 1) {
        const puzzleElement = puzzleLine.querySelector(`#${lineID}_word_${arrayWithIDs[i]}`);
        puzzleLine.appendChild(puzzleElement);
      }
    });
  }

  static shuffleIDs(puzzleLineLength) {
    const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    arr.length = puzzleLineLength;
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    return arr;
  }

  addEventListeners() {
    this.buttonCheck.addEventListener('click', () => this.checkResult());
    this.buttonContinue.addEventListener('click', () => this.continueGame());
    this.buttonDontKnow.addEventListener('click', () => this.helpPlayerHePressedDontKnow());
    this.gameLine.addEventListener('mousedown', () => GameArea.removeOverlays());
  }

  static addDragAndDropListeners() {
    document.addEventListener('dragstart', (event) => {
      dragAndDropObjects.dragged = event.target;
    }, false);

    document.addEventListener('dragend', (event) => {
      event.preventDefault();
      if (event.target.closest('.dropzone')) {
        if (dragAndDropObjects.dropBefore
          && dragAndDropObjects.dragged !== dragAndDropObjects.dropBefore) {
          dragAndDropObjects.dragged.parentNode.removeChild(dragAndDropObjects.dragged);
          dragAndDropObjects.dropBefore.before(dragAndDropObjects.dragged);
        } else if (dragAndDropObjects.targetLine) {
          dragAndDropObjects.dragged.parentNode.removeChild(dragAndDropObjects.dragged);
          dragAndDropObjects.targetLine.appendChild(dragAndDropObjects.dragged);
        }
      }
    }, false);

    document.addEventListener('dragenter', (event) => {
      dragAndDropObjects.dropBefore = event.target.closest('.puzzle__element_active');
      dragAndDropObjects.targetLine = event.target.closest('.dropzone');
    }, false);

    document.addEventListener('drop', (event) => {
      event.preventDefault();

      if (event.target.closest('.dropzone')) {
        if (dragAndDropObjects.dropBefore
          && dragAndDropObjects.dragged !== dragAndDropObjects.dropBefore) {
          dragAndDropObjects.dragged.parentNode.removeChild(dragAndDropObjects.dragged);
          dragAndDropObjects.dropBefore.before(dragAndDropObjects.dragged);
        } else if (dragAndDropObjects.targetLine) {
          dragAndDropObjects.dragged.parentNode.removeChild(dragAndDropObjects.dragged);
          dragAndDropObjects.targetLine.appendChild(dragAndDropObjects.dragged);
        }
      }
    }, false);
  }

  addPuzzlesEventListeners() {
    const testPuzzleLine = document.getElementById(`game_line_${gameData.activePhrase}`);
    const puzzlesToMove = testPuzzleLine.querySelectorAll('.puzzle__element');
    this.puzzlesEventListener = (event) => this.replacePuzzleElement(event);
    puzzlesToMove.forEach((puzzleToMove) => puzzleToMove.addEventListener('click', this.puzzlesEventListener));
    puzzlesToMove.forEach((puzzleToMove) => puzzleToMove.addEventListener('mousedown', (event) => {
      const temp = event.target;
      temp.closest('.puzzle__element').style.zIndex = '3';
    }));
  }

  replacePuzzleElement(event) {
    GameArea.removeOverlays();

    if (event.target.closest('.puzzle__element')) {
      this.currentPuzzleElement = event.target.closest('.puzzle__element');
      let targetLine;
      if (this.currentPuzzleElement.closest('.game__line')) {
        targetLine = document.getElementById(`line_${gameData.activePhrase}`);
      } else {
        targetLine = document.getElementById(`game_line_${gameData.activePhrase}`);
      }
      targetLine.append(this.currentPuzzleElement);
    }
  }

  checkResult() {
    GameArea.removeOverlays();
    const mainPuzzleLine = document.getElementById(`line_${gameData.activePhrase}`);
    const testPuzzleLine = document.getElementById(`game_line_${gameData.activePhrase}`);
    const puzzlesInMainLine = mainPuzzleLine.querySelectorAll('.puzzle__element');
    const puzzleInTestLine = testPuzzleLine.querySelectorAll('.puzzle__element');

    let correctWords = 0;

    puzzlesInMainLine.forEach((puzzleElement, index) => {
      const elementID = puzzleElement.getAttribute('id').slice(-1);
      if (Number(elementID) === index) {
        puzzleElement.querySelector('.puzzle__element__overlay_green').classList.remove('display-none');
        correctWords += 1;
      } else {
        puzzleElement.querySelector('.puzzle__element__overlay_red').classList.remove('display-none');
      }
    });

    puzzleInTestLine.forEach((puzzleElement, index) => {
      const elementID = puzzleElement.getAttribute('id').slice(-1);
      if (Number(elementID) === index) {
        puzzleElement.querySelector('.puzzle__element__overlay_green').classList.remove('display-none');
        correctWords += 1;
      } else {
        puzzleElement.querySelector('.puzzle__element__overlay_red').classList.remove('display-none');
      }
    });

    if (correctWords === puzzlesInMainLine.length + puzzleInTestLine.length) {
      gameData.gameResultsCorrect.push(gameData.activePhrase);
      const currentWordId = gameData.wordsCollection[gameData.activePhrase].id;
      Repository.saveWordResult({ wordId: currentWordId, result: '2', isGame: true });
      GameArea.updateStatistics(1, 0);
      GameArea.addShadowToLineNumber('correct');
      this.setControlButtons('continue');
      this.removePuzzlesToMainLine();
    } else {
      this.setControlButtons('check+dontknow');
    }
  }

  static activatePuzzleLines() {
    const testPuzzleLine = document.getElementById(`game_line_${gameData.activePhrase}`);
    testPuzzleLine.classList.add('game_line_indexZ_1', 'dropzone');
    const puzzleLine = document.getElementById(`line_${gameData.activePhrase}`);
    puzzleLine.classList.add('dropzone', 'dropzone-highlight');

    if (gameData.activePhrase > 0) {
      const testPuzzleLinePrev = document.getElementById(`game_line_${gameData.activePhrase - 1}`);
      testPuzzleLinePrev.classList.remove('game_line_indexZ_1', 'dropzone');
      const puzzleLinePrev = document.getElementById(`line_${gameData.activePhrase - 1}`);
      puzzleLinePrev.classList.remove('dropzone', 'dropzone-highlight');
    } else {
      const testPuzzleLinePrev = document.getElementById('game_line_9');
      testPuzzleLinePrev.classList.remove('game_line_indexZ_1', 'dropzone');
      const puzzleLinePrev = document.getElementById('line_9');
      puzzleLinePrev.classList.remove('dropzone', 'dropzone-highlight');
    }
  }

  async continueGame() {
    GameArea.removeOverlays();
    if (gameData.activePhrase < gameData.phrasesToDisplay.length - 1) {
      this.removePuzzlesToMainLine();
      gameData.activePhrase += 1;
      GameArea.activatePuzzleLines();
      this.setControlButtons('check');
      this.addPuzzlesEventListeners();
      if (promptsSettings.autoAudioPlay) {
        Prompts.playPhraseAudio();
      }
      prompts.setTranslationText();
    } else if (painting.classList.contains('display-none')) {
      painting.classList.remove('display-none');
      paintingInfo.classList.remove('display-none');
      prompts.clearTranslationText();
      this.setControlButtons('continue+results');
    } else if (gameData.userWords) {
      Navigation.openNavigationModal();
    } else {
      GameArea.defineNextlevelAndPage();
      this.setControlButtons('none');
      await StartNewGame.startGame();
    }
  }

  static defineNextlevelAndPage() {
    if (gameData.level === 5 && gameData.page === levelsAndPages[gameData.level]) {
      gameData.level = 0;
      gameData.page = 0;
    } else if (gameData.page < levelsAndPages[gameData.level]) {
      gameData.page += 1;
    } else {
      gameData.level += 1;
      gameData.page = 0;
    }
  }

  setControlButtons(mode) {
    if (mode === 'check') {
      this.buttonCheck.classList.remove('display-none');
      this.buttonContinue.classList.add('display-none');
      this.buttonResults.classList.add('display-none');
      this.buttonDontKnow.classList.add('display-none');
    } else if (mode === 'continue') {
      this.buttonCheck.classList.add('display-none');
      this.buttonContinue.classList.remove('display-none');
      this.buttonResults.classList.add('display-none');
      this.buttonDontKnow.classList.add('display-none');
    } else if (mode === 'check+dontknow') {
      this.buttonCheck.classList.remove('display-none');
      this.buttonContinue.classList.add('display-none');
      this.buttonResults.classList.add('display-none');
      this.buttonDontKnow.classList.remove('display-none');
    } else if (mode === 'continue+results') {
      this.buttonCheck.classList.add('display-none');
      this.buttonContinue.classList.remove('display-none');
      this.buttonResults.classList.remove('display-none');
      this.buttonDontKnow.classList.add('display-none');
    } else if (mode === 'none') {
      this.buttonCheck.classList.add('display-none');
      this.buttonContinue.classList.add('display-none');
      this.buttonResults.classList.add('display-none');
      this.buttonDontKnow.classList.add('display-none');
    }
  }

  async helpPlayerHePressedDontKnow() {
    this.removePuzzlesToMainLine();
    gameData.gameResultsWrong.push(gameData.activePhrase);
    const alternativeId = '_id';
    const currentWordId = gameData.wordsCollection[gameData.activePhrase].id
    || gameData.wordsCollection[gameData.activePhrase][alternativeId];
    Repository.saveWordResult({ wordId: currentWordId, result: '0', isGame: true });
    GameArea.updateStatistics(0, 1);
    GameArea.addShadowToLineNumber('wrong');
    await this.continueGame();
  }

  static async updateStatistics(correct, wrong) {
    const puzzleStatistic = JSON.parse(localStorage.getItem('puzzleStatistic'));
    if (gameData.userWords) {
      if (puzzleStatistic[`level_${gameData.userWordsLevel}`] && gameData.activePhrase !== 0) {
        let [correctAnswers, wrongAnswers, date] = puzzleStatistic[`level_${gameData.userWordsLevel}`];
        correctAnswers += correct;
        wrongAnswers += wrong;
        date = getTodayShort();
        puzzleStatistic[`level_${gameData.userWordsLevel}`] = [correctAnswers, wrongAnswers, date];
      } else {
        puzzleStatistic[`level_${gameData.userWordsLevel}`] = [correct, wrong, getTodayShort()];
      }
      localStorage.setItem('puzzleStatistic', JSON.stringify(puzzleStatistic));
      Repository.saveGameResult('puzzle', null, null, puzzleStatistic);
    } else {
      if (puzzleStatistic[`${gameData.level}.${gameData.page}`] && gameData.activePhrase !== 0) {
        let [correctAnswers, wrongAnswers, date] = puzzleStatistic[`${gameData.level}.${gameData.page}`];
        correctAnswers += correct;
        wrongAnswers += wrong;
        date = getTodayShort();
        puzzleStatistic[`${gameData.level}.${gameData.page}`] = [correctAnswers, wrongAnswers, date];
      } else {
        puzzleStatistic[`${gameData.level}.${gameData.page}`] = [correct, wrong, getTodayShort()];
      }
      localStorage.setItem('puzzleStatistic', JSON.stringify(puzzleStatistic));
      Repository.saveGameResult('puzzle', null, null, puzzleStatistic);
    }
  }

  removePuzzlesToMainLine() {
    const mainPuzzleLine = document.getElementById(`line_${gameData.activePhrase}`);
    const testPuzzleLine = document.getElementById(`game_line_${gameData.activePhrase}`);
    const puzzleElementFromTestLine = testPuzzleLine.querySelectorAll('.puzzle__element');
    puzzleElementFromTestLine.forEach((elem) => mainPuzzleLine.append(elem));
    const puzzleElementFromMainLine = mainPuzzleLine.querySelectorAll('.puzzle__element');
    for (let i = 0; i < puzzleElementFromMainLine.length; i += 1) {
      const element = document.getElementById(`line_${gameData.activePhrase}_word_${i}`);
      mainPuzzleLine.append(element);
      element.removeEventListener('click', this.puzzlesEventListener);
      element.classList.remove('puzzle__element_active');
      element.classList.add('puzzle__element_completed');
      element.setAttribute('draggable', 'false');
    }
    mainPuzzleLine.classList.remove('line_active');
    testPuzzleLine.classList.remove('game_line_indexZ_1');
    if (!promptsSettings.painting) {
      Prompts.addPuzzleBackgroundToCompletedPuzzles();
    }
  }

  static removeOverlays() {
    const mainPuzzleLine = document.getElementById(`line_${gameData.activePhrase}`);
    const testPuzzleLine = document.getElementById(`game_line_${gameData.activePhrase}`);
    const overlaysMain = mainPuzzleLine.querySelectorAll('.puzzle__element__overlay_red, .puzzle__element__overlay_green');
    overlaysMain.forEach((overlay) => {
      overlay.classList.add('display-none');
    });
    const overlaysTest = testPuzzleLine.querySelectorAll('.puzzle__element__overlay_red, .puzzle__element__overlay_green');
    overlaysTest.forEach((overlay) => {
      overlay.classList.add('display-none');
    });
  }

  static addShadowToLineNumber(typeOfShadow) {
    const activeLineMarker = document.querySelector(`.line-number_${gameData.activePhrase}`);
    if (typeOfShadow === 'wrong') {
      activeLineMarker.classList.add('line-number_wrong');
    } else {
      activeLineMarker.classList.add('line-number_correct');
    }
  }
}

export const gameArea = new GameArea();
