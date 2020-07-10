import 'bootstrap/js/dist/collapse';
import '@fortawesome/fontawesome-free/js/all.min';
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
  const startNewRound = new StartNewRound(savannahState);
  const startNewGame = new StartNewGame(savannahState, startNewRound);
  const proceedAnswer = new ProceedAnswer(savannahState, startNewRound, startNewGame);
  const controlPanel = new ControlPanel(savannahState, startNewRound);
  const results = new Results(startNewGame, savannahState);
  const header = new Header();
  function openNavigationTable() {
    function backToAuthorizationPage() {
      window.location.href = 'authorization.html';
    }
    if (localStorage.getItem('settings')) {
      const navigationModal = new NavigationModal();
      navigationModal.appendSelf();
      NavigationModal.showModal(NavigationModal.delete);
    } else {
      const fetchErrorMessage = document.querySelector('.fetchErrorMessageOnLoad');
      if (!fetchErrorMessage) {
        const messageModal = new MessageModal();
        messageModal.appendSelf('fetchErrorMessageOnLoad');
      }
      MessageModal.showModal('Sorry, something went wrong. Did you sign in?', backToAuthorizationPage);
    }
  }

  async function getStatisticsFromBackend() {
    let userStatistics;
    let savannahStatistic = { init: 0 };
    try {
      userStatistics = await Repository.getStatistics();
    } catch (error) {
      userStatistics = {};
    } finally {
      const path = userStatistics.optional.games;
      if (path && path.savannah) {
        savannahStatistic = userStatistics.optional.games.savannah.summary;
      } else {
        Repository.saveGameResult('savannah', false, [], savannahStatistic);
      }
    }
    localStorage.setItem('savannahStatistic', JSON.stringify(savannahStatistic));
  }

  await getStatisticsFromBackend();
  header.run();
  results.setEventListeners();
  proceedAnswer.setEventListeners();
  controlPanel.setEventListeners();
  controlPanel.setSoundModeOnLoad();
  const buttonStart = document.querySelector('.button__start');
  const buttonStatisticAndNavigation = document.querySelector('.button__statistics-navigation');
  buttonStatisticAndNavigation.addEventListener('click', () => openNavigationTable());
  buttonStart.addEventListener('click', () => openNavigationTable());
};
