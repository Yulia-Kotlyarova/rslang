import '../../../sass/styles.scss';
import { scrambleMsg } from '../../constants/defaultSettings';

const scrambleGuess = document.getElementById('sectionStart__input');
const scrambleBtn = document.querySelector('.sectionStart__btn');
let sPlay = false;
const sWords = ['javascript', 'android', 'reactjs'];
let newWords = '';
let randWords = '';

const createNewWords = () => {
  const ranNum = Math.floor(Math.random() * sWords.length);
  const newTempSwords = sWords[ranNum];
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

const srambleGameFirst = () => {
  scrambleBtn.addEventListener('click', () => {
    if (!sPlay) {
      sPlay = true;
      scrambleBtn.innerHTML = 'Guess';
      scrambleGuess.classList.toggle('hidden');
      newWords = createNewWords();
      randWords = scrambleWords(newWords.split(''));
      scrambleMsg.innerHTML = randWords.join('');
    } else {
      const tempWord = scrambleGuess.value;
      if (tempWord === newWords) {
        sPlay = false;
        scrambleMsg.innerHTML = `correct ${newWords}`;
        scrambleBtn.innerHTML = 'Next word';
        scrambleGuess.classList.toggle('hidden');
        scrambleGuess.value = '';
      } else {
        scrambleMsg.innerHTML = `Incorrect, try again ${newWords}`;
      }
    }
  });
};

window.onload = () => {
  srambleGameFirst();
};
