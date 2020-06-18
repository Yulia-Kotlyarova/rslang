import '../../../sass/styles.scss';
import { savannahState } from './appState';
import '@fortawesome/fontawesome-free/js/all.min';

import StartNewGame from './StartNewGame';
import StartNewRound from './StartNewRound';
import ProceedAnswer from './ProceedAnswer';
// import Answer from './StartNewGame';

window.onload = async function onload() {
  const startNewRound = new StartNewRound(savannahState);
  const startNewGame = new StartNewGame(savannahState, startNewRound);
  const proceedAnswer = new ProceedAnswer(savannahState);
  proceedAnswer.setEventListeners();
  startNewGame.startGame();
};
