import '@fortawesome/fontawesome-free/js/all.min';
import '../../../sass/styles.scss';
import savannahState from './appState';

import StartNewGame from './StartNewGame';
import StartNewRound from './StartNewRound';
import ProceedAnswer from './ProceedAnswer';

window.onload = async function onload() {
  const startNewRound = new StartNewRound(savannahState);
  const startNewGame = new StartNewGame(savannahState, startNewRound);
  const proceedAnswer = new ProceedAnswer(savannahState, startNewRound);
  proceedAnswer.setEventListeners();
  const buttonStart = document.querySelector('.button__start');
  buttonStart.addEventListener('click', () => {
    const startPage = document.querySelector('.start-page');
    startPage.classList.add('hidden');
    startNewGame.startGame();
  });
};
