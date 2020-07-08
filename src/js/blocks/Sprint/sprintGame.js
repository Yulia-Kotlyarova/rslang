import { wordArrayWords, wordArrayTranslation, wordArrayAudios } from './SprintBackend';

const wordCardEn = document.getElementById('game__board-middle-en');
const yesOrNoButton = document.querySelector('.game__board-bottom');
const wordCardRu = document.getElementById('game__board-middle-ru');
const wordToCheckEn = document.getElementsByClassName('game__board-middle-check_eng');
const wordToCheckRu = document.getElementsByClassName('game__board-middle-check_ru');
const tickAppearOnCorrect = document.querySelector('.game__board-bottom .fa-check-circle');
const tickAppearOnWrong = document.querySelector('.game__board-bottom .fa-times-circle');
const borderOnCorrect = document.querySelector('.game__board');
const borderOnWrong = document.querySelector('.game__board');
const leftPress = document.getElementById('button_left');
const rightPress = document.getElementById('button_right');
const changingScore = document.querySelector('.game__points-point');
const scoreChange = document.getElementById('game__board_top-point_num');
const changeColorOnScore = document.querySelector('.game__board-top');
const fistTick = document.getElementsByClassName('fa-check-circle');

export const objForCorrectWord = {
  eng: [],
  ru: [],
  audio: [],
};
export const objForInCorrectWord = {
  eng: [],
  ru: [],
  audio: [],
};

let ii = 0;
let k = 0;

let equal = true;
const letsCount = [];

function play(song) {
  const audio = new Audio(song);
  audio.play();
}

const checkCorrectOrNot = () => {
  const kkk = k - 1;
  let engValueIndex;
  let ruValueIndex;
  if (kkk % 2 === 0) {
    engValueIndex = wordArrayWords.indexOf(wordToCheckEn[0].textContent);
    ruValueIndex = wordArrayTranslation.indexOf(wordToCheckRu[0].textContent);
  } else {
    engValueIndex = wordArrayTranslation.indexOf(wordToCheckEn[0].textContent);
    ruValueIndex = wordArrayWords.indexOf(wordToCheckRu[0].textContent);
  }
  if (engValueIndex === ruValueIndex) {
    equal = true;
  } if (engValueIndex !== ruValueIndex) {
    equal = false;
  }
};

const addWordToCard = () => {
  if (k % 2 === 0) {
    wordCardEn.textContent = wordArrayWords[k];
    wordCardRu.textContent = wordArrayTranslation[k];
  } else {
    wordCardEn.textContent = wordArrayTranslation[k];
    if (k % 3 === 0) {
      wordCardRu.textContent = wordArrayWords[Math.floor(Math.random()
        * wordArrayTranslation.length)];
    } else {
      wordCardRu.textContent = wordArrayWords[k];
    }
  }
  k += 1;
  if (letsCount.length === 5 || letsCount.length === 10 || letsCount.length === 15
    || letsCount.length === 20) {
    play('phiu2.wav');
  }
  setTimeout(() => {
    leftPress.classList.remove('colorLeft');
    rightPress.classList.remove('colorRight');
    tickAppearOnCorrect.style.display = 'none';
    tickAppearOnWrong.style.display = 'none';
    borderOnCorrect.style.border = '2px solid #E5E5E3';
  }, 300);
  changingScore.textContent = letsCount.reduce((acc, val) => acc + val, 0);
  checkCorrectOrNot();
};

const scoreLogicCorrect = () => {
  if (letsCount.length < 4) {
    scoreChange.textContent = '+10';
    letsCount.push(10);
  }
  if (letsCount.length > 3 && letsCount.length < 9) {
    scoreChange.textContent = '+20';
    letsCount.push(20);
    changeColorOnScore.style.background = '#EDB216';
  }
  if (letsCount.length > 8 && letsCount.length < 14) {
    scoreChange.textContent = '+40';
    letsCount.push(40);
    changeColorOnScore.style.background = '#DB8650';
  }
  if (letsCount.length > 13 && letsCount.length < 19) {
    scoreChange.textContent = '+80';
    letsCount.push(80);
    changeColorOnScore.style.background = '#BD7283';
  }
  if (letsCount.length > 18 && letsCount.length < 24) {
    scoreChange.textContent = '+160';
    letsCount.push(160);
    changeColorOnScore.style.background = '#9B462C';
  }
  if (letsCount.length > 23 && letsCount.length < 29) {
    scoreChange.textContent = '+320';
    letsCount.push(320);
    changeColorOnScore.style.background = '#FFD700';
  }
  if (letsCount.length > 28) {
    scoreChange.textContent = '+640';
    letsCount.push(640);
    changeColorOnScore.style.background = '#EF1CDF';
  }
};

const scoreLogicInCorrect = () => {
  if (letsCount.length > 0) {
    const tmpScore = letsCount.pop();
    letsCount.push(tmpScore - 10);
  } else {
    letsCount.push(-10);
  }
};

const addWordToCardOnKeyPress = () => {
  window.addEventListener('keydown', (event) => {
    const kk = k - 1;
    if (event.keyCode === 37 && !equal) {
      play('phiu.wav');
      leftPress.classList.add('colorLeft');
      tickAppearOnCorrect.style.display = 'block';
      borderOnCorrect.style.border = '4px solid #5A7E51';
      if (kk % 2 === 0) {
        objForCorrectWord.eng.push(wordArrayWords[kk]);
        objForCorrectWord.ru.push(wordArrayTranslation[kk]);
      } else {
        objForCorrectWord.eng.push(wordArrayWords[kk]);
        objForCorrectWord.ru.push(wordArrayTranslation[kk]);
      }
      objForCorrectWord.audio.push(wordArrayAudios[kk]);
      if (ii < 3) {
        fistTick[ii].classList.add('tick-green');
        ii += 1;
      } else {
        Array.from(fistTick).forEach((val) => { const tmp = val; tmp.classList.remove('tick-green'); });
        ii = 0;
      }
      setTimeout(() => {
        scoreLogicCorrect();
        addWordToCard();
      }, 400);
    }
    if (event.keyCode === 39 && !equal) {
      play('error.wav');
      rightPress.classList.add('colorRight');
      tickAppearOnWrong.style.display = 'block';
      borderOnWrong.style.border = '4px solid rgba(255, 0, 0, 0.685)';
      if (kk % 2 === 0) {
        objForInCorrectWord.eng.push(wordArrayWords[kk]);
        objForInCorrectWord.ru.push(wordArrayTranslation[kk]);
      } else {
        objForInCorrectWord.eng.push(wordArrayWords[kk]);
        objForInCorrectWord.ru.push(wordArrayTranslation[kk]);
      }
      objForInCorrectWord.audio.push(wordArrayAudios[kk]);
      setTimeout(() => {
        scoreLogicInCorrect();
        addWordToCard();
      }, 400);
    }
    if (event.keyCode === 39 && equal) {
      play('phiu.wav');
      rightPress.classList.add('colorRight');
      tickAppearOnCorrect.style.display = 'block';
      borderOnCorrect.style.border = '4px solid #5A7E51';
      if (kk % 2 === 0) {
        objForCorrectWord.eng.push(wordArrayWords[kk]);
        objForCorrectWord.ru.push(wordArrayTranslation[kk]);
      } else {
        objForCorrectWord.eng.push(wordArrayWords[kk]);
        objForCorrectWord.ru.push(wordArrayTranslation[kk]);
      }
      objForCorrectWord.audio.push(wordArrayAudios[kk]);
      if (ii < 3) {
        fistTick[ii].classList.add('tick-green');
        ii += 1;
      } else {
        Array.from(fistTick).forEach((val) => { const tmp = val; tmp.classList.remove('tick-green'); });
        ii = 0;
      }
      setTimeout(() => {
        scoreLogicCorrect();
        addWordToCard();
      }, 400);
    }
    if (event.keyCode === 37 && equal) {
      play('error.wav');
      leftPress.classList.add('colorLeft');
      tickAppearOnWrong.style.display = 'block';
      borderOnWrong.style.border = '4px solid rgba(255, 0, 0, 0.685)';
      if (kk % 2 === 0) {
        objForInCorrectWord.eng.push(wordArrayWords[kk]);
        objForInCorrectWord.ru.push(wordArrayTranslation[kk]);
      } else {
        objForInCorrectWord.eng.push(wordArrayWords[kk]);
        objForInCorrectWord.ru.push(wordArrayTranslation[kk]);
      }
      objForInCorrectWord.audio.push(wordArrayAudios[kk]);
      setTimeout(() => {
        scoreLogicInCorrect();
        addWordToCard();
      }, 400);
    }
  });
};

const addWordToCardOnPress = () => {
  yesOrNoButton.addEventListener('click', (e) => {
    const kk = k - 1;
    if (e.target.className === 'btn btn-danger' && !equal) {
      play('phiu.wav');
      tickAppearOnCorrect.style.display = 'block';
      borderOnCorrect.style.border = '4px solid #5A7E51';
      if (kk % 2 === 0) {
        objForCorrectWord.eng.push(wordArrayWords[kk]);
        objForCorrectWord.ru.push(wordArrayTranslation[kk]);
      } else {
        objForCorrectWord.eng.push(wordArrayWords[kk]);
        objForCorrectWord.ru.push(wordArrayTranslation[kk]);
      }
      objForCorrectWord.audio.push(wordArrayAudios[kk]);
      if (ii < 3) {
        fistTick[ii].classList.add('tick-green');
        ii += 1;
      } else {
        Array.from(fistTick).forEach((val) => { const tmp = val; tmp.classList.remove('tick-green'); });
        ii = 0;
      }
      setTimeout(() => {
        scoreLogicCorrect();
        addWordToCard();
      }, 400);
    }
    if (e.target.className === 'btn btn-success' && !equal) {
      play('error.wav');
      tickAppearOnWrong.style.display = 'block';
      borderOnWrong.style.border = '4px solid rgba(255, 0, 0, 0.685)';
      if (kk % 2 === 0) {
        objForInCorrectWord.eng.push(wordArrayWords[kk]);
        objForInCorrectWord.ru.push(wordArrayTranslation[kk]);
      } else {
        objForInCorrectWord.eng.push(wordArrayWords[kk]);
        objForInCorrectWord.ru.push(wordArrayTranslation[kk]);
      }
      objForInCorrectWord.audio.push(wordArrayAudios[kk]);
      setTimeout(() => {
        scoreLogicInCorrect();
        addWordToCard();
      }, 400);
    }

    if (e.target.className === 'btn btn-success' && equal) {
      play('phiu.wav');
      tickAppearOnCorrect.style.display = 'block';
      borderOnCorrect.style.border = '4px solid #5A7E51';
      if (kk % 2 === 0) {
        objForCorrectWord.eng.push(wordArrayWords[kk]);
        objForCorrectWord.ru.push(wordArrayTranslation[kk]);
      } else {
        objForCorrectWord.eng.push(wordArrayWords[kk]);
        objForCorrectWord.ru.push(wordArrayTranslation[kk]);
      }
      objForCorrectWord.audio.push(wordArrayAudios[kk]);
      if (ii < 3) {
        fistTick[ii].classList.add('tick-green');
        ii += 1;
      } else {
        Array.from(fistTick).forEach((val) => { const tmp = val; tmp.classList.remove('tick-green'); });
        ii = 0;
      }
      setTimeout(() => {
        scoreLogicCorrect();
        addWordToCard();
      }, 400);
    }
    if (e.target.className === 'btn btn-danger' && equal) {
      play('error.wav');
      tickAppearOnWrong.style.display = 'block';
      borderOnWrong.style.border = '4px solid rgba(255, 0, 0, 0.685)';
      if (kk % 2 === 0) {
        objForInCorrectWord.eng.push(wordArrayWords[kk]);
        objForInCorrectWord.ru.push(wordArrayTranslation[kk]);
      } else {
        objForInCorrectWord.eng.push(wordArrayWords[kk]);
        objForInCorrectWord.ru.push(wordArrayTranslation[kk]);
      }
      objForInCorrectWord.audio.push(wordArrayAudios[kk]);
      setTimeout(() => {
        scoreLogicInCorrect();
        addWordToCard();
      }, 400);
    }
  });
};

export const init = () => {
  addWordToCard();
  play('bong.wav');
  addWordToCardOnKeyPress();
  addWordToCardOnPress();
};
