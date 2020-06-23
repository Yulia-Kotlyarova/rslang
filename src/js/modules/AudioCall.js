/* eslint-disable no-plusplus */

import '@fortawesome/fontawesome-free/js/all.min';

import random from 'lodash/fp/random';

const dontKnowBtn = document.querySelector('.a-c-dont-know');
const nextBtn = document.querySelector('.a-c-next');
const playAnother = document.querySelector('.a-c-another-game-btn');
const playAgainBtn = document.querySelector('.a-c-again-btn');

const translate = document.querySelector('.a-c-translate');
const translateContainer = document.querySelector('.volume-trans');
const result = document.querySelector('.a-c-result-wrapper');
const resultWrong = document.querySelector('.a-c-result-wrong');
const resultRight = document.querySelector('.a-c-result-right');
const body = document.querySelector('.a-c-body');
const photo = document.querySelector('.audio-call-photo');

const word1 = document.querySelector('.word-list-1');
const word2 = document.querySelector('.word-list-2');
const word3 = document.querySelector('.word-list-3');
const word4 = document.querySelector('.word-list-4');
const word5 = document.querySelector('.word-list-5');
const wordList = document.querySelectorAll('.word-list > li');

const volumeUp = document.querySelector('#big-volume-up');
const littleVolumeUp = document.querySelector('.a-c-little-volume');
const volumeUpIcon = document.querySelector('.volume-up > audio');

localStorage.cardNumber = 1;
localStorage.wrong = '';
localStorage.right = '';

// wrong / right answer

function showRightAnswer() {
  littleVolumeUp.classList.remove('hidden');
  translateContainer.classList.remove('hidden');
}

const right = (event) => {
  dontKnowBtn.classList.add('hidden');
  if (event.target.textContent === translate.textContent) {
    localStorage.right += `,${translate.textContent}`;
  }
  const element = event.target;
  element.innerHTML += ' &#10004';
  photo.classList.remove('hidden');
  volumeUp.classList.add('hidden');
  showRightAnswer();
  wordList.forEach((el) => {
    el.removeEventListener('click', wrong);
    el.removeEventListener('click', right);
  });
};

const wrong = (event) => {
  dontKnowBtn.classList.add('hidden');
  if (event.target.textContent === translate.textContent) {
    console.log('err in wrong');
  } else {
    localStorage.wrong += `,${translate.textContent}`;
  }

  const element = event.target;
  if (element === dontKnowBtn) {
    dontKnowBtn.style.textDecoration = 'none';
  } else {
    element.style.textDecoration = 'line-through';
  }
  photo.classList.remove('hidden');
  volumeUp.classList.add('hidden');
  showRightAnswer();
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

async function getCard(taskWord) {
  try {
    let resp = await fetch('https://afternoon-falls-25894.herokuapp.com/words?page=1&group=0')
    resp = await resp.json();

    for (let i = 0; i < 5; i++) {
      const rand = random(1, 19);
      wordList[i].textContent = resp[rand].wordTranslate;
    }

    await wrongAnswer();
    const randPlace = random(0, 4);
    wordList[randPlace].textContent = taskWord.wordTranslate;
    translate.textContent = taskWord.wordTranslate;
    wordList[randPlace].removeEventListener('click', wrong);
    wordList[randPlace].addEventListener('click', right);
    photo.src = taskWord.image;

    dontKnowBtn.addEventListener('click', wrong);
  } catch (error) {
    throw new Error(console.error(error));
  }
}

function sayWord(sound) {
  const audio = new Audio();
  audio.src = sound;
  audio.autoplay = true;
}
/*
function soundClick(taskWord) {
  volumeUpIcon.src = taskWord.audio;
  volumeUpIcon.attributes.autoplay = 'autoplay';
  const sound = taskWord.audio;
  const audio = new Audio();
  audio.src = sound;
  audio.autoplay = true;

  volumeUp.addEventListener('click', () => audio.play());
  littleVolumeUp.addEventListener('click', () => audio.play());
  return audio;
}
*/
function checkWord(taskWord) {
  const currentWord = taskWord.wordTranslate;
  let arrWrong = localStorage.wrong.split(',');
  arrWrong = arrWrong.slice(1, arrWrong.length);
  if (arrWrong.includes(currentWord)) {
    console.log(arrWrong);
    getWords();
  }

  let arrRight = localStorage.right.split(',');
  arrRight = arrRight.slice(1, arrRight.length);
  if (arrRight.includes(currentWord)) {
    console.log(arrRight);
    getWords();
  }
}

async function getWords() { // change link * *
  try {
    let response = await fetch('https://afternoon-falls-25894.herokuapp.com/words?page=2&group=1')
    response = await response.json();
    const rand = random(1, 19);
    const taskWord = response[rand];
    await checkWord(taskWord);
    await getCard(taskWord);

    volumeUpIcon.src = taskWord.audio;
    volumeUpIcon.attributes.autoplay = 'autoplay';
    const sound = taskWord.audio;
    const audio = new Audio();
    audio.src = sound;
    audio.autoplay = true;

    volumeUp.addEventListener('click', () => audio.play());
    littleVolumeUp.addEventListener('click', () => audio.play());

    nextBtn.addEventListener('click', () => {
      volumeUp.removeEventListener('click', () => audio.play());
      littleVolumeUp.removeEventListener('click', () => audio.play());
    });
  } catch (error) {
    throw new Error(console.error(error));
  }
}
getWords();

// result of game

function gameResult() {
  document.querySelector('.word-list').classList.add('hidden');
  document.querySelector('.a-c-pic-wrapper').classList.add('hidden');
  nextBtn.classList.add('hidden');
  playAgainBtn.classList.remove('hidden');
  playAnother.classList.remove('hidden');
  result.classList.remove('hidden');

  let arrWrong = localStorage.wrong.split(',');
  arrWrong = arrWrong.slice(1, arrWrong.length);
  for (let i = 0; i < arrWrong.length; i++) {
    resultWrong.innerHTML += `<li class="a-c-result-li-wrong"> <span> ${arrWrong[i]} </span> </li>`;
  }

  let arrRight = localStorage.right.split(',');
  arrRight = arrRight.slice(1, arrRight.length);
  for (let i = 0; i < arrRight.length; i++) {
    resultRight.innerHTML += `<li class="a-c-result-li-right"> <span> ${arrRight[i]} </span> </li>`;
  }

  if (localStorage.wrong.length === 0) {
    document.querySelector('.a-c-result-wrong').classList.add('hidden');
  } else {
    document.querySelector('.a-c-result-wrong').classList.remove('hidden');
  }

  if (localStorage.right.length === 0) {
    document.querySelector('.a-c-result-right').classList.add('hidden');
  } else {
    document.querySelector('.a-c-result-right').classList.remove('hidden');
  }

  document.querySelector('.a-c-result-right > a').textContent = document.querySelectorAll('.a-c-result-right > li').length;
  document.querySelector('.a-c-result-wrong > a').textContent = document.querySelectorAll('.a-c-result-wrong > li').length;
}

// change background

function background() {
  body.classList.add(`a-c-back-${localStorage.cardNumber.length}`);
  body.classList.remove(`a-c-back-${localStorage.cardNumber.length - 1}`);
}

const nextCard = (audio) => {
  photo.classList.add('hidden');
  translateContainer.classList.add('hidden');
  if (localStorage.cardNumber.length >= 10) {
    gameResult();
  } else {
    dontKnowBtn.classList.remove('hidden');
    volumeUp.classList.remove('hidden');
    wordList.forEach((el) => {
      el.style.textDecoration = 'none';
    });
    localStorage.cardNumber += 1;
    getWords(); // relaunch loop
    background();
  }
};

nextBtn.addEventListener('click', nextCard);

function rightNumber(word) {
  dontKnowBtn.classList.add('hidden');
  if (word.textContent === translate.textContent) {
    localStorage.right += `,${translate.textContent}`;
  }
  const element = word;
  element.innerHTML += ' &#10004';
  volumeUp.classList.add('hidden');
  showRightAnswer();
}

function wrongNumber(word) {
  dontKnowBtn.classList.add('hidden');
  localStorage.wrong += `,${translate.textContent}`;

  const element = word;
  if (word === dontKnowBtn) {
    dontKnowBtn.style.textDecoration = 'none';
  } else {
    element.style.textDecoration = 'line-through';
  }
  volumeUp.classList.add('hidden');
  showRightAnswer();
}

window.onkeydown = function Next(e) {
  if (e.keyCode === 39) {
    nextCard();
    e.preventDefault();
    return false;
  }
  if (e.keyCode === 49) {
    if (word1.textContent === translate.textContent && document.querySelector('.volume-trans').classList.contains('hidden')) {
      rightNumber(word1);
    } else if (document.querySelector('.volume-trans').classList.contains('hidden')) {
      wrongNumber(word1);
    }
  }
  if (e.keyCode === 50) {
    if (word2.textContent === translate.textContent && document.querySelector('.volume-trans').classList.contains('hidden')) {
      rightNumber(word2);
    } else if (document.querySelector('.volume-trans').classList.contains('hidden')) {
      wrongNumber(word2);
    }
  }
  if (e.keyCode === 51) {
    if (word3.textContent === translate.textContent && document.querySelector('.volume-trans').classList.contains('hidden')) {
      rightNumber(word3);
    } else if (document.querySelector('.volume-trans').classList.contains('hidden')) {
      wrongNumber(word3);
    }
  }
  if (e.keyCode === 52) {
    if (word4.textContent === translate.textContent && document.querySelector('.volume-trans').classList.contains('hidden')) {
      rightNumber(word4);
    } else if (document.querySelector('.volume-trans').classList.contains('hidden')) {
      wrongNumber(word4);
    }
  }
  if (e.keyCode === 53) {
    if (word5.textContent === translate.textContent && document.querySelector('.volume-trans').classList.contains('hidden')) {
      rightNumber(word5);
    } else if (document.querySelector('.volume-trans').classList.contains('hidden')) {
      wrongNumber(word5);
    }
  }
};
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

function createWordList(response) {
  function newWord(response) {
    let rand = randomInteger(min, max);
    let word = new WordTrain(`${response[rand].word}`, `${response[rand].wordTranslate}`, `${response[rand].audio}`, `${response[rand].image}`);
    // console.log(word);
    return word;
  }

  let word11 = newWord(response);
  let word22 = newWord(response);
  let word33 = newWord(response);
  let word44 = newWord(response);
  let word55 = newWord(response);

  console.log(word1);
  return (word11, word22, word33, word44, word55);
}
*/
// add remover counter when go out the game

export {
  showRightAnswer, right, wrong, wrongAnswer, getCard, sayWord,
  getWords, gameResult, nextCard, background,
  rightNumber, wrongNumber,
};
