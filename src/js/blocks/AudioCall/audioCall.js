/* eslint-disable no-plusplus */
import '../../../sass/styles.scss';

import '@fortawesome/fontawesome-free/js/all.min';

import random from 'lodash/fp/random';

const dontKnowBtn = document.querySelector('.a-c-dont-know');
const volumeUp = document.querySelector('#big-volume-up');

const volumeUpIcon = document.querySelector('.volume-up > audio');
const wordList = document.querySelectorAll('.word-list > li');

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
    el.classList.add('.li-pale-color');
    el.addEventListener('click', wrong);
  });
}

// array for each word

function getCard(taskWord) {
  fetch('https://afternoon-falls-25894.herokuapp.com/words?page=3&group=0')
    .then((resp) => resp.json())
    .then((resp) => {
      for (let i = 0; i < 5; i++) {
        const rand = random(1, 19);
        wordList[i].textContent = resp[rand].wordTranslate;
      }
    })
    .then(() => wrongAnswer())
    .then(() => {
      const randPlace = random(0, 4);
      wordList[randPlace].textContent = taskWord.wordTranslate;
      wordList[randPlace].removeEventListener('click', wrong);
      wordList[randPlace].addEventListener('click', right);
      document.querySelector('.audio-call-photo').src = taskWord.image;
      document.querySelector('.audio-call-photo').classList.remove('hidden');
    })
    .then(() => {
      dontKnowBtn.classList.add('hidden');
    })
    .catch((error) => (console.error(error)));
}

function soundClick(taskWord) {
  volumeUpIcon.src = taskWord.audio;
  volumeUpIcon.attributes.autoplay = 'autoplay';
  const sound = taskWord.audio;
  document.querySelector('.fa-volume-up').addEventListener('click', () => {
    const audio = new Audio();
    audio.src = sound;
    audio.autoplay = true;
  });
  getCard(taskWord);
}

function getWords() { 
  fetch('https://afternoon-falls-25894.herokuapp.com/words?page=3&group=5')
    .then((response) => response.json())
    .then((response) => {
      const rand = random(1, 19);
      const taskWord = response[rand];
      return taskWord;
    })
    .then((taskWord) => soundClick(taskWord))
    .catch((error) => (console.error(error)));
}
getWords();

