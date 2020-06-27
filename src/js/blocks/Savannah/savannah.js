import '@fortawesome/fontawesome-free/js/all.min';
import '../../../sass/styles.scss';
import { savannahState } from './appState';

import StartNewGame from './StartNewGame';
import StartNewRound from './StartNewRound';
import ProceedAnswer from './ProceedAnswer';
import ControlPanel from './ControlPanel';

window.onload = async function onload() {
  const startNewRound = new StartNewRound(savannahState);
  const startNewGame = new StartNewGame(savannahState, startNewRound);
  const proceedAnswer = new ProceedAnswer(savannahState, startNewRound);
  const controlPanel = new ControlPanel(savannahState, startNewRound);
  proceedAnswer.setEventListeners();
  controlPanel.setEventListeners();
  controlPanel.setSoundMode();
  const buttonStart = document.querySelector('.button__start');
  buttonStart.addEventListener('click', () => {
    const startPage = document.querySelector('.start-page');
    startPage.classList.add('hidden');
    startNewGame.startGame();
  });
};
