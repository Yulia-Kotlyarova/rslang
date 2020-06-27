import '../../../sass/styles.scss';
import openModal from './sprintStat';
import './sprintStart';
import './sprintGame';
import './SprintBackend';

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;
let runItOnce = true;

const COLOR_CODES = {
  info: {
    color: 'green',
  },
  warning: {
    color: 'orange',
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: 'red',
    threshold: ALERT_THRESHOLD,
  },
};

const TIME_LIMIT = 30;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
const remainingPathColor = COLOR_CODES.info.color;

function onTimesUp() {
  clearInterval(timerInterval);
}

function play(song) {
  const audio = new Audio(song);
  audio.play();
}

function uclicked(song) {
  const audio = new Audio(song);
  audio.play();
}
window.uclicked = uclicked;

function formatTime(time) {
  let seconds = time % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${seconds}`;
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById('base-timer-path-remaining')
    .setAttribute('stroke-dasharray', circleDasharray);
}

function setRemainingPathColor() {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById('base-timer-path-remaining')
      .classList.remove(warning.color);
    document
      .getElementById('base-timer-path-remaining')
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById('base-timer-path-remaining')
      .classList.remove(info.color);
    document
      .getElementById('base-timer-path-remaining')
      .classList.add(warning.color);
  }
}

export default function startTimer() {
  timerInterval = setInterval(() => {
    const timePassed2 = timePassed + 1;
    timePassed = timePassed2;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById('base-timer-label').innerHTML = formatTime(
      timeLeft,
    );
    setCircleDasharray();
    setRemainingPathColor(timeLeft);
    if (timeLeft === 0) {
      play('end.wav');
      onTimesUp();
      openModal();
    }
    if (timeLeft < 5) {
      if (runItOnce) {
        play('clock.wav');
        runItOnce = false;
      }
    }
  }, 1000);
}

document.getElementById('app').innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft,
  )}</span>
</div>
`;
setTimeout(() => {
  startTimer();
}, 6000);
