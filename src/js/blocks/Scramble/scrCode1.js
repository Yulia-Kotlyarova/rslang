import { scrambleMsg } from '../../constants/defaultSettings';
import { arrayWord, arrayWordTranslate } from './scrCode2backend';
import addHintsToBoxes from './scrCode3hint';
import { counterArray, updateScore } from './scrCode5Counter';

const scrambleGuess = document.getElementById('sectionStart__input');
const scrambleBtn = document.querySelector('.sectionStart__btn');
const scrHint = document.querySelector('.sectionStart__hintArea');
const pressForHint = document.querySelector('.sectionStart__pressForHint');
const scrSentence = document.querySelector('.sectionStart__sentence');
const counterContainer = document.querySelector('.counter');

let sPlay = false;
let newWords = '';
let randWords = '';
let wordCounter = 0;

function clickTune(song) {
  const audio = new Audio(song);
  audio.play();
}
const createNewWords = () => {
  const ranNum = wordCounter;
  const newTempSwords = arrayWord[ranNum];
  return newTempSwords;
};

const scrambleWords = (arr) => {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const insideArray = arr;
    const temp = insideArray[i];
    const j = Math.floor(Math.random() * (i + 1));
    insideArray[i] = insideArray[j];
    insideArray[j] = temp;
  }
  return arr;
};

export const scrambleGameFirst = () => {
  scrambleBtn.addEventListener('click', () => {
    if (!sPlay) {
      sPlay = true;
      scrambleBtn.innerHTML = 'Guess';
      scrambleGuess.classList.toggle('hidden');
      pressForHint.classList.remove('hidden');
      newWords = createNewWords();
      randWords = scrambleWords(newWords.split(''));
      scrambleMsg.innerHTML = randWords.join('');
      scrSentence.classList.add('hidden');
      counterContainer.classList.add('hidden');
      addHintsToBoxes(wordCounter);
      wordCounter += 1;
    } else {
      const tempWord = scrambleGuess.value;
      if (tempWord === newWords) {
        clickTune('Right-answer-ding-ding-sound-effect.mp3');
        counterArray.push(10);
        sPlay = false;
        scrambleMsg.innerHTML = `${newWords} - ${arrayWordTranslate[wordCounter - 1]}`;
        scrambleBtn.innerHTML = 'Next word';
        scrambleGuess.classList.add('hidden');
        pressForHint.classList.add('hidden');
        scrHint.classList.add('hidden');
        scrambleGuess.value = '';
        scrSentence.classList.remove('hidden');
        counterContainer.classList.remove('hidden');
        setTimeout(() => {
          updateScore();
        }, 700);
      } else {
        clickTune('error.wav');
        scrambleMsg.innerHTML = `Попробуй еще раз "${randWords.join('')}"`;
        setTimeout(() => {
          scrambleMsg.innerHTML = randWords.join('');
        }, 5000);
      }
    }
  });
};

export const hintShow = () => {
  pressForHint.addEventListener('click', () => {
    pressForHint.classList.add('hidden');
    scrHint.classList.remove('hidden');
  });
};

export { counterArray };
