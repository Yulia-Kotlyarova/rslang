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
const navigationModal = new NavigationModal();

async function openNavigationTable() {
  let userStatistics;
  let puzzleStatistic = { init: 0 };
  try {
    userStatistics = await Repository.getStatistics();
    const path = userStatistics.optional;
    if (path.games && path.games.puzzle) {
      puzzleStatistic = userStatistics.optional.games.puzzle.summary;
    } else {
      Repository.saveGameResult('savannah', false, [], puzzleStatistic);
    }
    localStorage.setItem('puzzleStatistic', JSON.stringify(puzzleStatistic));
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

window.onload = async function onload() {
  header.run();
  navigation.addEventListeners();
  prompts.addEventListeners();
  Prompts.getPromptsSettings();
  prompts.applyPromptsSettings();
  gameArea.addEventListeners();
  results.addEventListeners();
  const buttonStart = document.querySelector('.button__start');
  buttonStart.addEventListener('click', async () => openNavigationTable());
  try {
    const statistics = await Repository.getStatistics();
    localStorage.setItem('statistics', JSON.stringify(statistics));
  } catch (error) {
    const fetchErrorMessage = document.querySelector('.fetchErrorMessageOnLoad');
    if (!fetchErrorMessage) {
      const messageModal = new MessageModal();
      messageModal.appendSelf('fetchErrorMessageOnLoad');
    }
    MessageModal.showModal('Sorry, something went wrong. Did you log in?');
  }
};
