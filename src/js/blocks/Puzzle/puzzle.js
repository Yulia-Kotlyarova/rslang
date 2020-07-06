import '../../../sass/styles.scss';
import 'bootstrap/js/dist/collapse';
import '@fortawesome/fontawesome-free/js/all.min';
import Prompts from './Prompts';
import { gameArea } from './GameArea';
import Results from './Results';
import Navigation from './Navigation';
import Header from '../../modules/Header';
import NavigationModal from './NavigationModal';
import Repository from '../../modules/Repository';

const results = new Results();
const navigation = new Navigation();
const prompts = new Prompts();
const header = new Header();

function openNavigationTable() {
  const navigationModal = new NavigationModal();
  navigationModal.appendSelf();
  NavigationModal.showModal(NavigationModal.delete);
}

async function getStatisticsFromBackend() {
  const userStatistics = await Repository.getStatistics();
  let puzzleStatistic = {};
  if (userStatistics.optional.games.puzzle.summary) {
    puzzleStatistic = userStatistics.optional.games.puzzle.summary;
    localStorage.setItem('puzzleStatistic', JSON.stringify(puzzleStatistic));
  } else {
    Repository.saveGameResult('puzzle', false, [], JSON.stringify(puzzleStatistic));
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
};
