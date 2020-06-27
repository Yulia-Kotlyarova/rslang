export default class Navigation {
  constructor(startNewGame, savannahState) {
    this.startNewGame = startNewGame;
    this.savannahState = savannahState;
    this.selectLevel = document.querySelector('.level__select');
    this.selectPage = document.querySelector('.page__select');
  }

  setEventListeners() {
    this.selectLevel.addEventListener('change', () => this.resetPageSelect());
    this.selectPage.addEventListener('change', () => this.defineNewGameOptions());
  }

  resetPageSelect() {
    clearInterval(this.savannahState.timerId);
    this.selectPage.selectedIndex = 0;
    this.savannahState.currentPage = this.selectPage.selectedIndex;
    this.savannahState.currentLevel = this.selectLevel.selectedIndex;
    this.startNewGame.startGame();
  }

  defineNewGameOptions() {
    clearInterval(this.savannahState.timerId);
    this.savannahState.currentLevel = this.selectLevel.selectedIndex;
    this.savannahState.currentPage = this.selectPage.selectedIndex;
    this.startNewGame.startGame();
  }

  updatetNavigationFields() {
    this.selectLevel.selectedIndex = this.savannahState.currentLevel;
    this.selectPage.selectedIndex = this.savannahState.currentPage;
  }
}
