import { gameData } from './appState';
import NavigationModal from './NavigationModal';

export default class Navigation {
  constructor() {
    this.buttonStatisticsNavigation = document.querySelector('.button__statistics-navigation');
  }

  addEventListeners() {
    this.buttonStatisticsNavigation.addEventListener('click', () => Navigation.openNavigationModal());
  }

  static openNavigationModal() {
    const navigationModal = new NavigationModal();
    navigationModal.appendSelf();
    NavigationModal.showModal(NavigationModal.delete);
  }

  static updateLines() {
    const testPuzzleLine = document.getElementById(`game_line_${gameData.activePhrase}`);
    testPuzzleLine.classList.remove('game_line_indexZ_1', 'dropzone');
    const puzzleLine = document.getElementById(`line_${gameData.activePhrase}`);
    puzzleLine.classList.remove('dropzone', 'dropzone-highlight');
  }
}
