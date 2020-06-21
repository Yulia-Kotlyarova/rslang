/* eslint-disable import/no-cycle */
import StartNewGame from './StartNewGame';
import { gameData } from './appState';

const startNewGame = new StartNewGame();
export default class Navigation {
  constructor() {
    this.selectLevel = document.querySelector('.level__select');
    this.selectPage = document.querySelector('.page__select');
  }

  addEventListeners() {
    this.selectLevel.addEventListener('change', () => this.resetPageSelect());
    this.selectPage.addEventListener('change', () => this.defineNewGameOptions());
  }

  resetPageSelect() {
    this.selectPage.selectedIndex = 0;
    this.selectPage.classList.remove(`level_${gameData.level + 1}`);
    gameData.page = this.selectPage.selectedIndex;
    gameData.level = this.selectLevel.selectedIndex;
    this.selectPage.classList.add(`level_${gameData.level + 1}`);
    startNewGame.startGame();
  }

  defineNewGameOptions() {
    gameData.level = this.selectLevel.selectedIndex;
    gameData.page = this.selectPage.selectedIndex;
    startNewGame.startGame();
  }

  updatetNavigationFields(prevLevel) {
    this.selectPage.classList.remove(`level_${prevLevel + 1}`);
    this.selectLevel.selectedIndex = gameData.level;
    this.selectPage.selectedIndex = gameData.page;
    this.selectPage.classList.add('page__select', `level_${gameData.level + 1}`);
  }
}
