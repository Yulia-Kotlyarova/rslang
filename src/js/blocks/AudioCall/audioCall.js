/* eslint-disable no-plusplus */
import '../../../sass/styles.scss';

import 'bootstrap/js/dist/tab';

import '@fortawesome/fontawesome-free/js/all.min';

const dontKnowBtn = document.querySelector('.a-c-dont-know');
// const nextBtn = document.querySelector('.a-c-next');
// const playAnother = document.querySelector('.a-c-another-game-btn');
// const playAgainBtn = document.querySelector('.a-c-again-btn');
const volumeUp = document.querySelector('#big-volume-up');

const volumeUpIcon = document.querySelector('.volume-up > audio');
const wordList = document.querySelectorAll('.word-list > li');
// let photo = document.querySelector('.audio-call-photo');

// const min;
// const max;

function randomInteger(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

// wrong / right answer

const wrong = (event) => {
  const element = event.target;
  element.style.textDecoration = 'line-through';
  volumeUp.classList.add('hidden');
  wordList.forEach((el) => {
    el.removeEventListener('click', wrong);
    el.removeEventListener('click', right);
  });
};

function wrongAnswer() {
  wordList.forEach((el) => {
    // eslint-disable-next-line no-param-reassign
    el.style.color = '3F5D79';
    el.addEventListener('click', wrong);
  });
}

// array for each word

function getCard(taskWord) {
  fetch('https://afternoon-falls-25894.herokuapp.com/words?page=3&group=0')
    .then((resp) => resp.json())
    .then((resp) => {
      for (let i = 0; i < 5; i++) {
        const rand = randomInteger(1, 19);
        // console.log(rand);
        wordList[i].textContent = resp[rand].wordTranslate;
      }
    })
    .then(() => wrongAnswer())
    .then(() => {
      const randPlace = randomInteger(0, 4);
      console.log(randPlace);
      console.log(taskWord.word);
      wordList[randPlace].textContent = taskWord.wordTranslate;
      console.log(wordList[randPlace].textContent);
      wordList[randPlace].removeEventListener('click', wrong);
      wordList[randPlace].addEventListener('click', right);
      document.querySelector('.audio-call-photo').src = taskWord.image;
      document.querySelector('.audio-call-photo').classList.remove('hidden');
    })
    .then(() => {
      dontKnowBtn.classList.add('hidden');
    })
    .catch(() => (console.log('err in getCard')));
}

function soundClick(taskWord) {
  console.log(taskWord);
  volumeUpIcon.src = taskWord.audio;
  volumeUpIcon.attributes.autoplay = 'autoplay';
  const sound = taskWord.audio;
  // console.log(sound);
  document.querySelector('.fa-volume-up').addEventListener('click', () => {
    const audio = new Audio();
    audio.src = sound;
    audio.autoplay = true;
  });
  getCard(taskWord);
}

function getWords() { // change link * *
  fetch('https://afternoon-falls-25894.herokuapp.com/words?page=3&group=5')
    .then((response) => response.json())
    .then((response) => {
      const rand = randomInteger(1, 19);
      const taskWord = response[rand];
      // console.log(taskWord);
      return taskWord;
    })
    // .then((response) => createWordList(response))
    .then((taskWord) => soundClick(taskWord))
    // .then((response) => createCard(response))
    // .then((taskWord) => getCard(taskWord))
    .catch(() => (console.log('err')));
}
getWords();

/*
function createWordList(response) {
  class WordTrain {
    constructor(word, translate, image, audio) {
      this.word = word;
      this.translate = translate;
      this.image = image;
      this.audio = audio;
    }
  }

  function newWord(response) {
    let rand = randomInteger(min, max);
    let word = new WordTrain(`${response[rand].word}`, `${response[rand].wordTranslate}`,
    `${response[rand].audio}`, `${response[rand].image}`);
    // console.log(word);
    return word;
  }

  let word1 = newWord(response);
  let word2 = newWord(response);
  let word3 = newWord(response);
  let word4 = newWord(response);
  let word5 = newWord(response);

  console.log(word1);
  return (word1, word2, word3, word4, word5);
}
*/

// console.log(learnWord);

/*
window.onload = () => {
  getWordsArr();
};
*/
