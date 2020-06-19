import '../../../sass/styles.scss';
import { savannahState } from './appState';
import '@fortawesome/fontawesome-free/js/all.min';

import StartNewGame from './StartNewGame';
import StartNewRound from './StartNewRound';
import ProceedAnswer from './ProceedAnswer';
// import Results from './Results';
// import Answer from './StartNewGame';

window.onload = async function onload() {
  // console.log(results)
  const startNewRound = new StartNewRound(savannahState);
  const startNewGame = new StartNewGame(savannahState, startNewRound);
  // const myResults = new Results(savannahState);
  const proceedAnswer = new ProceedAnswer(savannahState, startNewRound);
  proceedAnswer.setEventListeners();
  startNewGame.startGame();
  // results.setEventListeners();
};

document.body.addEventListener('keydown', () => {
});
