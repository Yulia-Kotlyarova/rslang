import Results from './Results';
import { heartFill, heartStroke } from './consts';

export default class ProceedAnswer {
  constructor(savannahState, startNewRound) {
    this.savannahState = savannahState;
    this.startNewRound = startNewRound;
    this.answersArea = document.querySelector('.game__answers');
    this.activeWordContainer = document.querySelector('.game__active-word');
    this.heartContainer = document.querySelector('.control__lifes');
    this.heartFill = heartFill;
    this.heartStroke = heartStroke;
  }

  checkClickedAnswer(event) {
    clearInterval(this.savannahState.timerId);
    this.savannahState.isAnswered = true;
    const clickedAnswer = event.target.closest('.game__answer');
    if (clickedAnswer) {
      const clickedWordID = clickedAnswer.getAttribute('id');
      if (!Number(clickedWordID)) {
        this.catchCorrectAnswer(clickedAnswer);
      } else {
        this.catchWrongAnswer(clickedAnswer);
      }
    }
  }

  checkPressedButton(event) {
    const keyPressed = event.key;
    if (['1', '2', '3', '4'].includes(keyPressed)) {
      this.savannahState.isAnswered = true;
      const selectedAnswer = this.answersArea.querySelectorAll('.game__answer')[Number(keyPressed) - 1];
      const selectedAnswerID = selectedAnswer.getAttribute('id');
      if (!Number(selectedAnswerID)) {
        this.catchCorrectAnswer(selectedAnswer);
      } else {
        this.catchWrongAnswer(selectedAnswer);
      }
    }
  }

  setEventListeners() {
    this.answersArea.addEventListener('click', (event) => this.checkClickedAnswer(event));
    document.body.addEventListener('keydown', (event) => this.checkPressedButton(event));
  }

  catchCorrectAnswer(answer) {
    answer.querySelector('.answer__overlay-correct').classList.remove('hidden');
    const sound = '/src/audio/blocks/Savannah/answer-correct.mp3';
    ProceedAnswer.audioPlay(sound);
    this.savannahState.answeredCorrect.push(this.savannahState.activeWordID);
    setTimeout(() => {
      this.continueGame();
    }, 1000);
  }

  catchWrongAnswer(selectedAnswer) {
    if (this.savannahState.answeredWrong.length < 6) {
      const answers = this.answersArea.querySelectorAll('.game__answer');
      answers.forEach((answer) => {
        if (answer.id === '0') {
          answer.querySelector('.answer__overlay-correct').classList.remove('hidden');
        }
      });
      if (selectedAnswer) {
        selectedAnswer.querySelector('.answer__overlay-wrong').classList.remove('hidden');
      }
      const sound = '/src/audio/blocks/Savannah/answer-wrong.mp3';
      ProceedAnswer.audioPlay(sound);
      this.savannahState.answeredWrong.push(this.savannahState.activeWordID);
      setTimeout(() => {
        this.continueGame();
      }, 1000);
    } else {
      this.continueGame();
    }
  }

  countLifes() {
    const lifesInitial = 5;
    const lifesLost = this.savannahState.answeredWrong.length;
    const lifesLeft = lifesInitial - lifesLost;
    if (lifesLost < 5) {
      this.heartContainer.innerHTML = `${this.heartStroke.repeat(lifesLost)}${this.heartFill.repeat(lifesLeft)}`;
    } else {
      this.heartContainer.innerHTML = `${this.heartStroke.repeat(lifesLost)}`;
    }
  }

  continueGame() {
    if (this.savannahState.activeWord < 19 && this.savannahState.answeredWrong.length < 5) {
      this.countLifes();
      this.savannahState.activeWord += 1;
      this.startNewRound.startRound();
    } else {
      this.countLifes();
      this.clearWordsContainers();
      setTimeout(() => {
        const results = new Results(this.savannahState);
        results.showResults();
      }, 800);
    }
  }

  static audioPlay(sound) {
    const audio = document.querySelector('audio');
    audio.src = sound;
    audio.autoplay = true;
  }

  clearWordsContainers() {
    this.answersArea.innerHTML = '';
    this.activeWordContainer.innerText = '';
  }
}
