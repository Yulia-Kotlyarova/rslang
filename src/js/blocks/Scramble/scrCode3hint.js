import {
  arrayWordTranslate, arrayAudio, arraySentence, arrayTranscription, arrayImage,
  arrayWord, arrayWordId,
} from './scrCode2backend';
import { audioT } from '../../constants/defaultSettings';
import { objForCorrectWord } from './scrCode9Stat';

const scrImg = document.querySelector('.sectionStart__img img');
const scrTranslate = document.querySelector('.sectionStart__translate p');
const scrTranscript = document.querySelector('.sectionStart__transcript p');
const scrSentence = document.querySelector('.sectionStart__sentence');
const playTune = document.querySelector('.sectionStart__voice');

function myPlay(url) {
  const audio = new Audio(url);
  audio.play();
}

const onMouseMovePlay = () => {
  playTune.addEventListener('mouseenter', (e) => {
    if (e.target.classList[0] === 'sectionStart__voice') {
      myPlay(audioT.getAttribute('data-music'));
    }
  });
};

const addHintsToBoxes = (i) => {
  scrSentence.textContent = arraySentence[i];
  scrTranslate.textContent = arrayWordTranslate[i];
  scrTranscript.textContent = arrayTranscription[i];
  scrImg.src = arrayImage[i];
  audioT.setAttribute('data-music', arrayAudio[i]);
  // inserting into array for statistics
  objForCorrectWord.eng.push(arrayWord[i]);
  objForCorrectWord.ru.push(arrayWordTranslate[i]);
  objForCorrectWord.audio.push(arrayAudio[i]);
  objForCorrectWord.id.push(arrayWordId[i]);
  // this is function to listen word
  onMouseMovePlay();
};

export default addHintsToBoxes;
