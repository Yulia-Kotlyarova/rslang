import '../../../sass/styles.scss';
import { savannahState } from './appState';

import StartNewGame from './StartNewGame';
import StartNewRound from './StartNewRound';
// import CheckAnswer from './ProceedAnswer';
// import Answer from './StartNewGame';

window.onload = async function onload() {
  const startNewRound = new StartNewRound(savannahState);
  const startNewGame = new StartNewGame(savannahState, startNewRound);
  // const checkAnswer = new CheckAnswer(savannahState);
  startNewGame.startGame();
};

document.body.addEventListener('keydown', () => {
});
