// import '@fortawesome/fontawesome-free/js/all.min';
import '../../../sass/styles.scss';
import startTimer from './sprintStart';
import { init } from './sprintGame';
import { getWordsFromBackend } from './SprintBackend';

const FULL_DASH_ARRAY2 = 283;
const COLOR_CODES2 = {
  info: {
    color: 'green',
  },

};

const remainingPathColor2 = COLOR_CODES2.info.color;

const TIME_LIMIT = 5;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;

function onTimesUp2() {
  clearInterval(timerInterval);
  setTimeout(() => {
    startTimer();
    init();
  }, 1000);
}

function formatTime2(time) {
  let seconds = time % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${seconds}`;
}

function calculateTimeFraction2() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray2() {
  const circleDasharray = `${(
    calculateTimeFraction2() * FULL_DASH_ARRAY2
  ).toFixed(0)} 283`;
  document
    .getElementById('base-timer-path-remaining2')
    .setAttribute('stroke-dasharray', circleDasharray);
}

export default function startTimer2() {
  document.querySelector('.score__score2').addEventListener('click', () => {
    timerInterval = setInterval(() => {
      timePassed += 1;
      timeLeft = TIME_LIMIT - timePassed;
      document.querySelector('.startText').textContent = 'Приготовьтесь';
      document.querySelector('.gameLevel').style.display = 'none';
      document.getElementById('base-timer-label2').innerHTML = formatTime2(
        timeLeft,
      );
      setCircleDasharray2();
      if (timeLeft === 0) {
        onTimesUp2();
        document.querySelector('.wrapperSprint').style.display = 'flex';
        getWordsFromBackend(document.querySelector('.levelSelector').value);
      }
    }, 1000);
  });
}

document.getElementById('app2').innerHTML = `
<div class="base-timer2">
  <svg class="base-timer__svg2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle2">
      <circle class="base-timer__path-elapsed2" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining2"
        stroke-dasharray="283"
        class="base-timer__path-remaining2 ${remainingPathColor2}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label2" class="base-timer__label2">${formatTime2(
    timeLeft,
  )}</span>
</div>
`;

window.onload = () => {
  startTimer2();
};
