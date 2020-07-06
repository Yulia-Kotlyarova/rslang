import '@fortawesome/fontawesome-free/js/all.min';
import '../../../sass/styles.scss';
import { hintShow, scrambleGameFirst } from './scrCode1';
import './scrCode4ChangeSize';
import './scrCode3hint';
import { wordsFromDictionary } from './scrCode2backend';
import './scrCode5Counter';
import './test/scrCode6Test';
import './test/scrCode7TestController';
import startTest from './test/scrCode8App';
import { finishGame } from './scrCode9Stat';

const playGame = () => {
  const playButton = document.querySelector('.gameStartButton');
  const removeHide = document.querySelector('.sectionStart');
  playButton.addEventListener('click', () => {
    removeHide.classList.remove('gameStart-hidden');
    wordsFromDictionary(document.querySelector('.scrambleLevelSelector').value);
    scrambleGameFirst();
  });
};

function clickTune(song) {
  const audio = new Audio(song);
  audio.play();
}
window.clickTune = clickTune;

window.onload = () => {
  startTest();
  playGame();
  hintShow();
  finishGame();
};
