import '../../../sass/styles.scss';

import Prompts from './Prompts';
import { gameArea } from './GameArea';
import Results from './Results';
import StartNewGame from './StartNewGame';
import Navigation from './Navigation';

const results = new Results();
const navigation = new Navigation();
const prompts = new Prompts();

window.onload = function onload() {
  navigation.addEventListeners();
  prompts.addEventListeners();
  Prompts.getPromptsSettings();
  prompts.applyPromptsSettings();
  gameArea.addEventListeners();
  results.addEventListeners();
  StartNewGame.startGame();
};
