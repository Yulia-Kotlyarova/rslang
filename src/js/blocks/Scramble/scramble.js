import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faVolumeUp, faWindowClose, faVolumeDown } from '@fortawesome/free-solid-svg-icons';
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
import 'bootstrap/js/dist/collapse';
import Header from '../../modules/Header';
import Authorization from '../../modules/Authorization';

if (!Authorization.isSignedUp()) {
  window.location.href = 'promo.html#unauthorized';
} else {
  (async () => {
    await Authorization.getFreshToken();
  })();
}

library.add(faVolumeUp);
library.add(faWindowClose);
library.add(faVolumeDown);

dom.watch();

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
  const header = new Header();
  header.run();
  startTest();
  playGame();
  hintShow();
  finishGame();
};
