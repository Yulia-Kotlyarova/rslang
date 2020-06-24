/* eslint-disable semi */
import '../../../sass/styles.scss';

const API_KEY_TRS = 'trnsl.1.1.20200509T130827Z.c2ef7d3760909903.5b2cbc1a7fca3465812b94c8bce081ad43d94d02';
const API = 'https://translate.yandex.net/api/v1.5/tr.json/translate';

const wordArray = ['apple', 'banana', 'car', 'shoes', 'dress', 'spoon', 'street', 'sun', 'watch', 'carpet', 'fruits', 'boy', 'start', 'cat', 'hot', 'rain'];
const translatedArray = [];
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
};
export const objForInCorrectWord = {
  eng: [],
  ru: [],
};

let ii = 0;

let equal = true;
const letsCount = [];

function play(song) {
  const audio = new Audio(song);
  audio.play();
}

const addWordToCard = () => {
  wordCardEn.textContent = wordArray[Math.floor(Math.random() * wordArray.length)];
  wordCardRu.textContent = translatedArray[Math.floor(Math.random() * wordArray.length)];
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
  changingScore.textContent = letsCount.reduce((acc, val) => acc + val, 0)
}

const scoreLogicCorrect = () => {
  if (letsCount.length < 4) {
    scoreChange.textContent = '+10'
    letsCount.push(10);
  }
  if (letsCount.length > 3 && letsCount.length < 9) {
    scoreChange.textContent = '+20'
    letsCount.push(20)
    changeColorOnScore.style.background = '#EDB216';
  }
  if (letsCount.length > 8 && letsCount.length < 14) {
    scoreChange.textContent = '+40'
    letsCount.push(40)
    changeColorOnScore.style.background = '#DB8650';
  }
  if (letsCount.length > 13 && letsCount.length < 19) {
    scoreChange.textContent = '+80'
    letsCount.push(80)
    changeColorOnScore.style.background = '#BD7283';
  }
  if (letsCount.length > 18 && letsCount.length < 22) {
    scoreChange.textContent = '+160'
    letsCount.push(160)
    changeColorOnScore.style.background = '#9B462C';
  }
  if (letsCount.length > 21) {
    scoreChange.textContent = '+320'
    letsCount.push(320)
  }
}

const checkCorrectOrNot = () => {
  const val = wordToCheckEn[0].textContent;
  const toCompare = wordToCheckRu[0].textContent;
  const api = `${API}?key=${API_KEY_TRS}&text=${val}&lang=ru`;
  fetch(api)
    .then((res) => res.json())
    .then((data) => {
      if (data.text[0] === toCompare) {
        equal = true;
      } if (data.text[0] !== toCompare) {
        equal = false;
      }
    })
    .catch(() => {
    });
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
    if (event.keyCode === 37 && equal === false) {
      play('phiu.wav');
      leftPress.classList.add('colorLeft')
      tickAppearOnCorrect.style.display = 'block';
      borderOnCorrect.style.border = '4px solid #5A7E51'
      objForCorrectWord.eng.push(wordToCheckEn[0].textContent);
      objForCorrectWord.ru.push(wordToCheckRu[0].textContent);
      if (ii < 3) {
        fistTick.getElementsByTagName('i')[ii].style.color = '#5A7E51'
        ii += 1;
      } else {
        tickAppearOnScore.forEach((val) => { const tmp = val; tmp.style.color = null })
        ii = 0
      }
      scoreLogicCorrect()
      addWordToCard()
      checkCorrectOrNot()
    }
    if (event.keyCode === 39 && equal === false) {
      play('error.wav');
      rightPress.classList.add('colorRight')
      tickAppearOnWrong.style.display = 'block';
      borderOnWrong.style.border = '4px solid rgba(255, 0, 0, 0.685)';
      objForInCorrectWord.eng.push(wordToCheckEn[0].textContent);
      objForInCorrectWord.ru.push(wordToCheckRu[0].textContent);
      scoreLogicInCorrect()
      addWordToCard()
      checkCorrectOrNot()
    }
    if (event.keyCode === 39 && equal === true) {
      play('phiu.wav');
      rightPress.classList.add('colorRight')
      tickAppearOnCorrect.style.display = 'block';
      borderOnCorrect.style.border = '4px solid #5A7E51';
      objForCorrectWord.eng.push(wordToCheckEn[0].textContent);
      objForCorrectWord.ru.push(wordToCheckRu[0].textContent);
      fistTick.getElementsByTagName('i')[0].style.color = '#5A7E51'
      if (ii < 3) {
        fistTick.getElementsByTagName('i')[ii].style.color = '#5A7E51'
        ii += 1;
      } else {
        tickAppearOnScore.forEach((val) => { const tmp = val; tmp.style.color = null })
        ii = 0
      }
      scoreLogicCorrect()
      addWordToCard()
      checkCorrectOrNot()
    }
    if (event.keyCode === 37 && equal === true) {
      play('error.wav');
      leftPress.classList.add('colorLeft')
      tickAppearOnWrong.style.display = 'block';
      borderOnWrong.style.border = '4px solid rgba(255, 0, 0, 0.685)';
      objForInCorrectWord.eng.push(wordToCheckEn[0].textContent);
      objForInCorrectWord.ru.push(wordToCheckRu[0].textContent);
      scoreLogicInCorrect()
      addWordToCard()
      checkCorrectOrNot()
    }
  })
}
// export default addWordToCardOnKeyPress;

const addWordToCardOnPress = () => {
  yesOrNoButton.addEventListener('click', (e) => {
    if (e.target.className === 'btn btn-danger' && equal === false) {
      play('phiu.wav');
      tickAppearOnCorrect.style.display = 'block';
      borderOnCorrect.style.border = '4px solid #5A7E51';
      objForCorrectWord.eng.push(wordToCheckEn[0].textContent);
      objForCorrectWord.ru.push(wordToCheckRu[0].textContent);
      if (ii < 3) {
        fistTick.getElementsByTagName('i')[ii].style.color = '#5A7E51'
        ii += 1;
      } else {
        tickAppearOnScore.forEach((val) => { const tmp = val; tmp.style.color = null })
        ii = 0
      }
      scoreLogicCorrect()
      addWordToCard()
      checkCorrectOrNot()
    }
    if (e.target.className === 'btn btn-success' && equal === false) {
      play('error.wav');
      tickAppearOnWrong.style.display = 'block';
      borderOnWrong.style.border = '4px solid rgba(255, 0, 0, 0.685)';
      objForInCorrectWord.eng.push(wordToCheckEn[0].textContent);
      objForInCorrectWord.ru.push(wordToCheckRu[0].textContent);
      scoreLogicInCorrect()
      addWordToCard()
      checkCorrectOrNot()
    }

    if (e.target.className === 'btn btn-success' && equal === true) {
      play('phiu.wav');
      tickAppearOnCorrect.style.display = 'block';
      borderOnCorrect.style.border = '4px solid #5A7E51';
      objForCorrectWord.eng.push(wordToCheckEn[0].textContent);
      objForCorrectWord.ru.push(wordToCheckRu[0].textContent);
      if (ii < 3) {
        fistTick.getElementsByTagName('i')[ii].style.color = '#5A7E51'
        ii += 1;
      } else {
        tickAppearOnScore.forEach((val) => { const tmp = val; tmp.style.color = null })
        ii = 0
      }
      scoreLogicCorrect()
      addWordToCard()
      checkCorrectOrNot()
    }
    if (e.target.className === 'btn btn-danger' && equal === true) {
      play('error.wav');
      tickAppearOnWrong.style.display = 'block';
      borderOnWrong.style.border = '4px solid rgba(255, 0, 0, 0.685)';
      objForInCorrectWord.eng.push(wordToCheckEn[0].textContent);
      objForInCorrectWord.ru.push(wordToCheckRu[0].textContent);
      scoreLogicInCorrect()
      addWordToCard()
      checkCorrectOrNot()
    }
  })
}

const yanTranslate = {
  translate() {
    wordArray.forEach((val) => {
      const api = `${API}?key=${API_KEY_TRS}&text=${val}&lang=ru`;
      fetch(api)
        .then((res) => res.json())
        .then((data) => {
          translatedArray.push(data.text[0]);
        })
        .catch(() => {
        });
    })
    setTimeout(() => {
      addWordToCard();
      checkCorrectOrNot();
    }, 1000);
  },
} // end of object yanTranslate

// window.addEventListener('load', () => {
//   addWordToCardOnKeyPress();
//   yanTranslate.translate();
//   addWordToCardOnPress();
// })

export const init = () => {
  play('bong.wav');
  addWordToCardOnKeyPress();
  yanTranslate.translate();
  addWordToCardOnPress();
};

// export default init();
