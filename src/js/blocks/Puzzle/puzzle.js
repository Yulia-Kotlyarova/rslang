import '../../../sass/styles.scss';
import 'bootstrap/js/dist/collapse';
import Prompts from './Prompts';
import { gameArea } from './GameArea';
import Results from './Results';
import Navigation from './Navigation';
import Header from '../../modules/Header';
import NavigationModal from './NavigationModal';
import Repository from '../../modules/Repository';
import MessageModal from '../../modules/MessageModal';

const results = new Results();
const navigation = new Navigation();
const prompts = new Prompts();
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
  let puzzleStatistic = { init: 0 };
  try {
    userStatistics = await Repository.getStatistics();
  } catch (error) {
    userStatistics = {};
  } finally {
    const path = userStatistics.optional.games;
    if (path && path.puzzle) {
      puzzleStatistic = userStatistics.optional.games.puzzle.summary;
    } else {
      Repository.saveGameResult('puzzle', false, [], puzzleStatistic);
    }
  }
  localStorage.setItem('puzzleStatistic', JSON.stringify(puzzleStatistic));
}

window.onload = async function onload() {
  await getStatisticsFromBackend();
  header.run();
  navigation.addEventListeners();
  prompts.addEventListeners();
  Prompts.getPromptsSettings();
  prompts.applyPromptsSettings();
  gameArea.addEventListeners();
  results.addEventListeners();
  const buttonStart = document.querySelector('.button__start');
  buttonStart.addEventListener('click', () => openNavigationTable());
  const statistics = await Repository.getStatistics();
  localStorage.setItem('statistics', JSON.stringify(statistics));
};
