import 'bootstrap/js/dist/collapse';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faHeart, faVolumeUp, faVolumeMute, faMusic,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartEmpty } from '@fortawesome/free-regular-svg-icons';
import '../../../sass/styles.scss';
import { savannahState } from './appState';
import Header from '../../modules/Header';
import Repository from '../../modules/Repository';
import NavigationModal from './NavigationModal';
import MessageModal from '../../modules/MessageModal';
import StartNewGame from './StartNewGame';
import StartNewRound from './StartNewRound';
import ProceedAnswer from './ProceedAnswer';
import ControlPanel from './ControlPanel';
import Results from './Results';

window.onload = async function onload() {
  library.add(faHeart);
  library.add(faVolumeUp);
  library.add(faVolumeMute);
  library.add(faHeartEmpty);
  library.add(faMusic);
  dom.watch();
  const navigationModal = new NavigationModal();
  const startNewRound = new StartNewRound(savannahState);
  const startNewGame = new StartNewGame(savannahState, startNewRound);
  const proceedAnswer = new ProceedAnswer(savannahState, startNewRound, startNewGame);
  const controlPanel = new ControlPanel(savannahState, startNewRound);
  const results = new Results(startNewGame, savannahState, navigationModal);
  const header = new Header();
  async function openNavigationTable() {
    let userStatistics;
    let savannahStatistic = { init: 0 };
    try {
      userStatistics = await Repository.getStatistics();
      const path = userStatistics.optional;
      if (path.games && path.games.savannah) {
        savannahStatistic = userStatistics.optional.games.savannah.summary;
      } else {
        Repository.saveGameResult('savannah', false, [], savannahStatistic);
      }
      localStorage.setItem('savannahStatistic', JSON.stringify(savannahStatistic));
      navigationModal.appendSelf();
      NavigationModal.showModal(NavigationModal.delete);
    } catch (error) {
      const fetchErrorMessage = document.querySelector('.fetchErrorMessageOnLoad');
      if (!fetchErrorMessage) {
        const messageModal = new MessageModal();
        messageModal.appendSelf('fetchErrorMessageOnLoad');
      }
      MessageModal.showModal('Sorry, something went wrong. Did you log in?');
    }
  }

  header.run();
  proceedAnswer.setEventListeners();
  controlPanel.setEventListeners();
  controlPanel.setSoundModeOnLoad();
  const buttonStart = document.querySelector('.button__start');
  const buttonStatisticAndNavigation = document.querySelector('.button__statistics-navigation');
  const buttonPlayAgain = document.querySelector('.button__play-again');
  const buttonPlayNextGame = document.querySelector('.button__play-next-game');
  buttonStatisticAndNavigation.addEventListener('click', () => openNavigationTable());
  buttonStart.addEventListener('click', () => openNavigationTable());
  buttonPlayAgain.addEventListener('click', () => {
    results.resultsContainer.classList.add('hidden');
    const isPlayAgain = true;
    startNewGame.startGame(isPlayAgain);
  });
  buttonPlayNextGame.addEventListener('click', () => {
    results.resultsContainer.classList.add('hidden');
    if (savannahState.userWords) {
      navigationModal.appendSelf();
      NavigationModal.showModal(NavigationModal.delete);
    } else {
      results.defineNextlevelAndPage();
      startNewGame.startGame();
    }
  });
  const statistics = await Repository.getStatistics();
  localStorage.setItem('statistics', JSON.stringify(statistics));
};
