import '../../../sass/styles.scss';
import 'bootstrap/js/dist/collapse';
import '@fortawesome/fontawesome-free/js/all.min';
import Prompts from './Prompts';
import { gameArea } from './GameArea';
import Results from './Results';
import Navigation from './Navigation';
import Header from '../../modules/Header';
// import Repository from '../../modules/Repository';
import NavigationModal from './NavigationModal';

const results = new Results();
const navigation = new Navigation();
const prompts = new Prompts();
const header = new Header();

function openNavigationTable() {
  const navigationModal = new NavigationModal();
  navigationModal.appendSelf();
  NavigationModal.showModal(NavigationModal.delete);
}

// async function getStatisticsFromBackend() {
//   const userStatistics = await Repository.getStatistics();
//   if (userStatistics.optional.games.puzzle.summary) {
//     const englishPuzzle = userStatistics.optional.games.puzzle.summary;
//     localStorage.setItem('englishPuzzle', englishPuzzle);
//   } else {

//   }

// }

window.onload = function onload() {
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
