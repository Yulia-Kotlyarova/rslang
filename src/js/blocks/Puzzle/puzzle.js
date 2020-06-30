import '../../../sass/styles.scss';

import Prompts from './Prompts';
import { gameArea } from './GameArea';
import Results from './Results';
import StartNewGame from './startNewGame';
import Navigation from './Navigation';

const results = new Results();
const navigation = new Navigation();
const prompts = new Prompts();

function closeStartPage() {
  const startPage = document.querySelector('.start__page');
  startPage.classList.add('display-none');
  StartNewGame.startGame();
}

window.onload = function onload() {
  navigation.addEventListeners();
  prompts.addEventListeners();
  Prompts.getPromptsSettings();
  prompts.applyPromptsSettings();
  gameArea.addEventListeners();
  results.addEventListeners();
  const buttonStart = document.querySelector('.button__start');
  buttonStart.addEventListener('click', () => closeStartPage());
};
