/* eslint-disable semi */
import '../../../sass/styles.scss';
import { wordArray1, wordArray2, wordArray3 } from './SprintBackend';

const wordCardEn = document.getElementById('game__board-middle-en');
const yesOrNoButton = document.querySelector('.game__board-bottom');
const wordCardRu = document.getElementById('game__board-middle-ru');
const wordToCheckEn = document.getElementsByClassName('game__board-middle-check_eng')
const wordToCheckRu = document.getElementsByClassName('game__board-middle-check_ru')
const tickAppearOnCorrect = document.querySelector('.game__board-bottom .fa-check-circle')
const tickAppearOnWrong = document.querySelector('.game__board-bottom .fa-times-circle')
const borderOnCorrect = document.querySelector('.game__board');
const borderOnWrong = document.querySelector('.game__board');
const leftPress = document.getElementById('button_left');
const rightPress = document.getElementById('button_right');
const changingScore = document.querySelector('.game__points-point')
const scoreChange = document.getElementById('game__board_top-point_num');
const changeColorOnScore = document.querySelector('.game__board-top');
const fistTick = document.querySelector('.game__board-top_score_checks');
const tickAppearOnScore = document.querySelectorAll('.game__board-top_score_checks .fa-check-circle');

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
let k = 0

let equal = true;
const letsCount = [];

function play(song) {
  const audio = new Audio(song);
  audio.play();
}

const checkCorrectOrNot = () => {
  const kkk = k - 1;
  let engValueIndex
  let ruValueIndex
  if (kkk % 2 === 0) {
    engValueIndex = wordArray1.indexOf(wordToCheckEn[0].textContent);
    ruValueIndex = wordArray2.indexOf(wordToCheckRu[0].textContent);
  } else {
    engValueIndex = wordArray2.indexOf(wordToCheckEn[0].textContent);
    ruValueIndex = wordArray1.indexOf(wordToCheckRu[0].textContent);
  }
  if (engValueIndex === ruValueIndex) {
    equal = true;
  } if (engValueIndex !== ruValueIndex) {
    equal = false;
  }
}

const addWordToCard = () => {
  if (k % 2 === 0) {
    wordCardEn.textContent = wordArray1[k];
    wordCardRu.textContent = wordArray2[k];
  } else {
    wordCardEn.textContent = wordArray2[k];
    if (k % 3 === 0) {
      wordCardRu.textContent = wordArray1[Math.floor(Math.random() * wordArray2.length)];
    } else {
      wordCardRu.textContent = wordArray1[k];
    }
  }
  k += 1;
  if (letsCount.length === 5 || letsCount.length === 10 || letsCount.length === 15
    || letsCount.length === 20) {
    play('phiu2.wav');
  }
  setTimeout(() => {
    leftPress.classList.remove('colorLeft')
    rightPress.classList.remove('colorRight')
    tickAppearOnCorrect.style.display = 'none';
    tickAppearOnWrong.style.display = 'none';
    borderOnCorrect.style.border = '2px solid #E5E5E3';
  }, 300);
  changingScore.textContent = letsCount.reduce((acc, val) => acc + val, 0);
  checkCorrectOrNot();
}

const scoreLogicCorrect = () => {
  console.log(letsCount.length);
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
  if (letsCount.length > 29) {
    scoreChange.textContent = '+640';
    letsCount.push(640);
    changeColorOnScore.style.background = '#ef1cdf';
  }
}

const scoreLogicInCorrect = () => {
  if (letsCount.length > 0) {
    const tmpScore = letsCount.pop()
    letsCount.push(tmpScore - 10)
  } else {
    letsCount.push(-10)
  }
}

const addWordToCardOnKeyPress = () => {
  window.addEventListener('keydown', (event) => {
    const kk = k - 1;
    if (event.keyCode === 37 && equal === false) {
      play('phiu.wav');
      leftPress.classList.add('colorLeft')
      tickAppearOnCorrect.style.display = 'block';
      borderOnCorrect.style.border = '4px solid #5A7E51'
      if (kk % 2 === 0) {
        objForCorrectWord.eng.push(wordArray1[kk]);
        objForCorrectWord.ru.push(wordArray2[kk]);
      } else {
        objForCorrectWord.eng.push(wordArray1[kk]);
        objForCorrectWord.ru.push(wordArray2[kk]);
      }
      objForCorrectWord.audio.push(wordArray3[kk]);
      if (ii < 3) {
        fistTick.getElementsByTagName('i')[ii].style.color = '#5A7E51'
        ii += 1;
      } else {
        tickAppearOnScore.forEach((val) => { const tmp = val; tmp.style.color = null })
        ii = 0
      }
      setTimeout(() => {
        scoreLogicCorrect();
        addWordToCard()
      }, 200);
    }
    if (event.keyCode === 39 && equal === false) {
      play('error.wav');
      rightPress.classList.add('colorRight')
      tickAppearOnWrong.style.display = 'block';
      borderOnWrong.style.border = '4px solid rgba(255, 0, 0, 0.685)';
      if (kk % 2 === 0) {
        objForInCorrectWord.eng.push(wordArray1[kk]);
        objForInCorrectWord.ru.push(wordArray2[kk]);
      } else {
        objForInCorrectWord.eng.push(wordArray1[kk]);
        objForInCorrectWord.ru.push(wordArray2[kk]);
      }
      objForInCorrectWord.audio.push(wordArray3[kk]);
      setTimeout(() => {
        scoreLogicInCorrect();
        addWordToCard()
      }, 200);
    }
    if (event.keyCode === 39 && equal === true) {
      play('phiu.wav');
      rightPress.classList.add('colorRight')
      tickAppearOnCorrect.style.display = 'block';
      borderOnCorrect.style.border = '4px solid #5A7E51';
      if (kk % 2 === 0) {
        objForCorrectWord.eng.push(wordArray1[kk]);
        objForCorrectWord.ru.push(wordArray2[kk]);
      } else {
        objForCorrectWord.eng.push(wordArray1[kk]);
        objForCorrectWord.ru.push(wordArray2[kk]);
      }
      objForCorrectWord.audio.push(wordArray3[kk]);
      fistTick.getElementsByTagName('i')[0].style.color = '#5A7E51'
      if (ii < 3) {
        fistTick.getElementsByTagName('i')[ii].style.color = '#5A7E51'
        ii += 1;
      } else {
        tickAppearOnScore.forEach((val) => { const tmp = val; tmp.style.color = null })
        ii = 0
      }
      setTimeout(() => {
        scoreLogicCorrect();
        addWordToCard()
      }, 200);
    }
    if (event.keyCode === 37 && equal === true) {
      play('error.wav');
      leftPress.classList.add('colorLeft')
      tickAppearOnWrong.style.display = 'block';
      borderOnWrong.style.border = '4px solid rgba(255, 0, 0, 0.685)';
      if (kk % 2 === 0) {
        objForInCorrectWord.eng.push(wordArray1[kk]);
        objForInCorrectWord.ru.push(wordArray2[kk]);
      } else {
        objForInCorrectWord.eng.push(wordArray1[kk]);
        objForInCorrectWord.ru.push(wordArray2[kk]);
      }
      objForInCorrectWord.audio.push(wordArray3[kk]);
      setTimeout(() => {
        scoreLogicInCorrect();
        addWordToCard()
      }, 200);
    }
  })
}

const addWordToCardOnPress = () => {
  yesOrNoButton.addEventListener('click', (e) => {
    const kk = k - 1;
    if (e.target.className === 'btn btn-danger' && equal === false) {
      play('phiu.wav');
      tickAppearOnCorrect.style.display = 'block';
      borderOnCorrect.style.border = '4px solid #5A7E51';
      if (kk % 2 === 0) {
        objForCorrectWord.eng.push(wordArray1[kk]);
        objForCorrectWord.ru.push(wordArray2[kk]);
      } else {
        objForCorrectWord.eng.push(wordArray1[kk]);
        objForCorrectWord.ru.push(wordArray2[kk]);
      }
      objForCorrectWord.audio.push(wordArray3[kk]);
      if (ii < 3) {
        fistTick.getElementsByTagName('i')[ii].style.color = '#5A7E51'
        ii += 1;
      } else {
        tickAppearOnScore.forEach((val) => { const tmp = val; tmp.style.color = null })
        ii = 0
      }
      setTimeout(() => {
        scoreLogicCorrect();
        addWordToCard()
      }, 200);
    }
    if (e.target.className === 'btn btn-success' && equal === false) {
      play('error.wav');
      tickAppearOnWrong.style.display = 'block';
      borderOnWrong.style.border = '4px solid rgba(255, 0, 0, 0.685)';
      if (kk % 2 === 0) {
        objForInCorrectWord.eng.push(wordArray1[kk]);
        objForInCorrectWord.ru.push(wordArray2[kk]);
      } else {
        objForInCorrectWord.eng.push(wordArray1[kk]);
        objForInCorrectWord.ru.push(wordArray2[kk]);
      }
      objForInCorrectWord.audio.push(wordArray3[kk]);
      setTimeout(() => {
        scoreLogicInCorrect();
        addWordToCard()
      }, 200);
    }

    if (e.target.className === 'btn btn-success' && equal === true) {
      play('phiu.wav');
      tickAppearOnCorrect.style.display = 'block';
      borderOnCorrect.style.border = '4px solid #5A7E51';
      if (kk % 2 === 0) {
        objForCorrectWord.eng.push(wordArray1[kk]);
        objForCorrectWord.ru.push(wordArray2[kk]);
      } else {
        objForCorrectWord.eng.push(wordArray1[kk]);
        objForCorrectWord.ru.push(wordArray2[kk]);
      }
      objForCorrectWord.audio.push(wordArray3[kk]);
      if (ii < 3) {
        fistTick.getElementsByTagName('i')[ii].style.color = '#5A7E51'
        ii += 1;
      } else {
        tickAppearOnScore.forEach((val) => { const tmp = val; tmp.style.color = null })
        ii = 0
      }
      setTimeout(() => {
        scoreLogicCorrect();
        addWordToCard()
      }, 200);
    }
    if (e.target.className === 'btn btn-danger' && equal === true) {
      play('error.wav');
      tickAppearOnWrong.style.display = 'block';
      borderOnWrong.style.border = '4px solid rgba(255, 0, 0, 0.685)';
      if (kk % 2 === 0) {
        objForInCorrectWord.eng.push(wordArray1[kk]);
        objForInCorrectWord.ru.push(wordArray2[kk]);
      } else {
        objForInCorrectWord.eng.push(wordArray1[kk]);
        objForInCorrectWord.ru.push(wordArray2[kk]);
      }
      objForInCorrectWord.audio.push(wordArray3[kk]);
      setTimeout(() => {
        scoreLogicInCorrect();
        addWordToCard()
      }, 200);
    }
  })
}

export const init = () => {
  addWordToCard();
  play('bong.wav');
  addWordToCardOnKeyPress();
  addWordToCardOnPress();
};
