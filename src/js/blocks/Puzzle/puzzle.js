import '../../../sass/styles.scss';
import 'bootstrap/js/dist/collapse';
import '@fortawesome/fontawesome-free/js/all.min';
import Prompts from './Prompts';
import { gameArea } from './GameArea';
import Results from './Results';
import StartNewGame from './startNewGame';
import Navigation from './Navigation';
import Header from '../../modules/Header';

const results = new Results();
const navigation = new Navigation();
const prompts = new Prompts();
const header = new Header();

function closeStartPage() {
  const startPage = document.querySelector('.start__page');
  const gameBody = document.querySelector('body');
  startPage.classList.add('display-none');
  gameBody.classList.remove('scroll-not');
  StartNewGame.startGame();
}

window.onload = function onload() {
  header.run();
  navigation.addEventListeners();
  prompts.addEventListeners();
  Prompts.getPromptsSettings();
  prompts.applyPromptsSettings();
  gameArea.addEventListeners();
  results.addEventListeners();
  const buttonStart = document.querySelector('.button__start');
  buttonStart.addEventListener('click', () => closeStartPage());
};
