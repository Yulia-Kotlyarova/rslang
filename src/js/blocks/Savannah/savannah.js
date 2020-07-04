import 'bootstrap/js/dist/collapse';
import '@fortawesome/fontawesome-free/js/all.min';
import '../../../sass/styles.scss';
import { savannahState } from './appState';
import Header from '../../modules/Header';

import StartNewGame from './StartNewGame';
import StartNewRound from './StartNewRound';
import ProceedAnswer from './ProceedAnswer';
import ControlPanel from './ControlPanel';
import Navigation from './Navigation';
import Results from './Results';

window.onload = async function onload() {
  const startNewRound = new StartNewRound(savannahState);
  const startNewGame = new StartNewGame(savannahState, startNewRound);
  const proceedAnswer = new ProceedAnswer(savannahState, startNewRound, startNewGame);
  const controlPanel = new ControlPanel(savannahState, startNewRound);
  const navigation = new Navigation(startNewGame, savannahState);
  const results = new Results(startNewGame, savannahState, navigation);
  const header = new Header();
  header.run();
  results.setEventListeners();
  proceedAnswer.setEventListeners();
  controlPanel.setEventListeners();
  controlPanel.setSoundModeOnLoad();
  navigation.setEventListeners();
  const buttonStart = document.querySelector('.button__start');
  buttonStart.addEventListener('click', () => {
    const startPage = document.querySelector('.start-page');
    startPage.classList.add('hidden');
    startNewGame.startGame();
  });
};
