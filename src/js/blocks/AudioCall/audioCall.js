/* eslint-disable no-plusplus */

import '../../../sass/styles.scss';
import 'bootstrap/js/dist/collapse';
import '@fortawesome/fontawesome-free/js/all.min';
import random from 'lodash/fp/random';
import Header from '../../modules/Header';
import Repository from '../../modules/Repository';
import getTodayShort from '../../helpers';

window.onload = () => {
  const header = new Header();
  header.run();

  const goBtn = document.querySelector('.a-c-go');
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
  const startScreen = document.querySelector('.a-c-hello-screen');
  const loader = document.querySelector('.a-c-loader');

  const word1 = document.querySelector('.word-list-1');
  const word2 = document.querySelector('.word-list-2');
  const word3 = document.querySelector('.word-list-3');
  const word4 = document.querySelector('.word-list-4');
  const word5 = document.querySelector('.word-list-5');
  const wordList = document.querySelectorAll('.word-list > li');

  const volumeUp = document.querySelector('#big-volume-up');
  const littleVolumeUp = document.querySelector('.a-c-little-volume');

  const audio = new Audio();
  const levelNumb = document.querySelector('.a-c-level').options.selectedIndex;
  const pageNumb = document.querySelector('.a-c-page').options.selectedIndex;
  const userLevel = document.querySelector('.a-c-level').options[levelNumb].value;
  const userPage = document.querySelector('.a-c-page').options[pageNumb].value;

  let isVictory;
  localStorage.cardNumber = 1;
  localStorage.wrong = '';
  localStorage.right = '';

  // wrong / right answer

  function showRightAnswer() {
    littleVolumeUp.classList.remove('hidden');
    translateContainer.classList.remove('hidden');
  }

  function wrongAnswer(wrong) {
    wordList.forEach((el) => {
      el.classList.add('.li-pale-color');
      el.addEventListener('click', wrong);
    });
  }

  function loaderChange() {
    if (localStorage.cardNumber.length <= 19) {
      loader.style.width = `${5 * localStorage.cardNumber.length}%`;
    } else {
      loader.style.width = '97%';
    }
  }

  // array for each word
  async function getCard(taskWord) {
    try {
      const resp = await Repository.getWordsFromGroupAndPage(userLevel, userPage);
      for (let i = 0; i < 5; i++) {
        const rand = random(1, 19);
        wordList[i].textContent = resp[rand].wordTranslate;
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
        resultRight.innerHTML += `<li class="a-c-result-li-right"> <i class="fas fa-music"> </i> <audio src = "${taskWord.audio}"> </audio> <span> ${taskWord.word} - ${taskWord.wordTranslate} </span> </li>`;
        wordList.forEach((el) => {
          // eslint-disable-next-line no-use-before-define
          el.removeEventListener('click', wrong);
          el.removeEventListener('click', right);
          el.classList.add('li-pale-color');
        });
        element.classList.remove('li-pale-color');
      };

      const wrong = (event) => {
        dontKnowBtn.removeEventListener('click', wrong);
        dontKnowBtn.classList.add('hidden');
        localStorage.wrong += `,${translate.textContent}`;

        const element = event.target;
        if (element === dontKnowBtn) {
          dontKnowBtn.style.textDecoration = 'none';
        } else {
          element.style.textDecoration = 'line-through';
        }
        photo.classList.remove('hidden');
        volumeUp.classList.add('hidden');
        resultWrong.innerHTML += `<li class="a-c-result-li-wrong"> <i class="fas fa-music"> </i> <audio src = "${taskWord.audio}"> </audio> <span> ${taskWord.word} - ${taskWord.wordTranslate} </span> </li>`;
        showRightAnswer();
        wordList.forEach((el) => {
          el.removeEventListener('click', wrong);
          el.removeEventListener('click', right);
          el.classList.add('li-pale-color');
        });
        element.classList.remove('li-pale-color');
      };

      await wrongAnswer(wrong);
      const randPlace = random(0, 4);
      wordList[randPlace].textContent = taskWord.wordTranslate;
      translate.textContent = taskWord.wordTranslate;
      wordList[randPlace].removeEventListener('click', wrong);
      wordList[randPlace].addEventListener('click', right);
      photo.src = taskWord.image;

      dontKnowBtn.addEventListener('click', wrong);

      const rightNumber = (word) => {
        photo.classList.remove('hidden');
        dontKnowBtn.classList.add('hidden');
        localStorage.right += `,${translate.textContent}`;
        const element = word;
        element.innerHTML += ' &#10004';
        volumeUp.classList.add('hidden');
        resultRight.innerHTML += `<li class="a-c-result-li-right"> <i class="fas fa-music"> </i> <audio src = "${taskWord.audio}"> </audio> <span> ${taskWord.word} - ${taskWord.wordTranslate} </span> </li>`;
        showRightAnswer();
        wordList.forEach((el) => {
          el.classList.add('li-pale-color');
        });
        element.classList.remove('li-pale-color');
      };

      const wrongNumber = (word) => {
        photo.classList.remove('hidden');
        dontKnowBtn.classList.add('hidden');
        localStorage.wrong += `,${translate.textContent}`;

        const element = word;
        if (word === dontKnowBtn) {
          dontKnowBtn.style.textDecoration = 'none';
        } else {
          element.style.textDecoration = 'line-through';
        }
        volumeUp.classList.add('hidden');
        resultWrong.innerHTML += `<li class="a-c-result-li-wrong"> <i class="fas fa-music"> </i> <audio src = "${taskWord.audio}"> </audio> <span> ${taskWord.word} - ${taskWord.wordTranslate} </span> </li>`;
        showRightAnswer();
        wordList.forEach((el) => {
          el.classList.add('li-pale-color');
        });
        element.classList.remove('li-pale-color');
      };

      window.onkeydown = function Next(e) {
        if (e.code === 'ArrowRight') {
          // eslint-disable-next-line no-use-before-define
          nextCard();
          e.preventDefault();
          return false;
        }

        if (e.code === 'Enter') {
          // eslint-disable-next-line no-use-before-define
          nextCard();
          e.preventDefault();
          return false;
        }

        if (e.code === 'Digit1') {
          if (word1.textContent === translate.textContent && document.querySelector('.volume-trans').classList.contains('hidden')) {
            rightNumber(word1);
          } else {
            wrongNumber(word1);
          }
        }
        if (e.code === 'Digit2') {
          if (word2.textContent === translate.textContent && document.querySelector('.volume-trans').classList.contains('hidden')) {
            rightNumber(word2);
          } else {
            wrongNumber(word2);
          }
        }
        if (e.code === 'Digit3') {
          if (word3.textContent === translate.textContent && document.querySelector('.volume-trans').classList.contains('hidden')) {
            rightNumber(word3);
          } else {
            wrongNumber(word3);
          }
        }
        if (e.code === 'Digit4') {
          if (word4.textContent === translate.textContent && document.querySelector('.volume-trans').classList.contains('hidden')) {
            rightNumber(word4);
          } else {
            wrongNumber(word4);
          }
        }
        if (e.code === 'Digit5') {
          if (word5.textContent === translate.textContent && document.querySelector('.volume-trans').classList.contains('hidden')) {
            rightNumber(word5);
          } else {
            wrongNumber(word5);
          }
        }
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  function removeStartScreen() {
    goBtn.classList.add('hidden');
    startScreen.classList.add('hidden');
  }

  async function getWords() { // change link  get UserWords
    removeStartScreen();

    try {
      const response = await Repository.getWordsFromGroupAndPage(userLevel, userPage);
      const taskWord = response[localStorage.cardNumber.length];
      const sound = taskWord.audio;
      audio.src = sound;
      audio.autoplay = true;

      await getCard(taskWord, sound);

      volumeUp.addEventListener('click', () => audio.play());
      littleVolumeUp.addEventListener('click', () => audio.play());

      nextBtn.addEventListener('click', () => {
        volumeUp.removeEventListener('click', () => audio.play());
        littleVolumeUp.removeEventListener('click', () => audio.play());
      });

      loaderChange();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  // start game

  goBtn.addEventListener('click', getWords);

  // result of game

  function gameResult() {
    loader.classList.add('hidden');
    document.querySelector('.word-list').classList.add('hidden');
    document.querySelector('.a-c-pic-wrapper').classList.add('hidden');
    nextBtn.classList.add('hidden');
    playAgainBtn.classList.remove('hidden');
    playAnother.classList.remove('hidden');
    result.classList.remove('hidden');

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

  const nextCard = () => {
    photo.classList.add('hidden');
    translateContainer.classList.add('hidden');
    wordList.forEach((el) => {
      el.classList.remove('li-pale-color');
    });
    if (localStorage.cardNumber.length >= 3) {
      gameResult();
    } else {
      dontKnowBtn.classList.remove('hidden');
      volumeUp.classList.remove('hidden');
      wordList.forEach((e) => {
        e.style.textDecoration = 'none';
      });
      localStorage.cardNumber += 1;
      getWords(); // relaunch loop
      background();
    }
  };

  nextBtn.addEventListener('click', nextCard);

  function playAgain() {
    goBtn.classList.add('hidden');
    startScreen.classList.add('hidden');
    localStorage.cardNumber = 1;
  }

  playAgainBtn.addEventListener('click', playAgain);

  window.beforeunload = () => {
    const sessionData = getTodayShort();

    if (localStorage.wrong.length > 0) {
      isVictory = false;
    } else {
      isVictory = true;
    }
    Repository.saveGameResult('Audio Call', isVictory, sessionData);
  };
};
