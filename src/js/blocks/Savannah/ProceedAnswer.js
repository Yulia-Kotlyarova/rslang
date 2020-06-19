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
    this.savannahState.isAnswered = true;
    const clickedAnswer = event.target.closest('.game__answer');
    if (clickedAnswer) {
      const clickedWordID = clickedAnswer.getAttribute('id');
      if (!Number(clickedWordID)) {
        this.catchCorrectAnswer();
      } else {
        this.catchWrongAnswer();
      }
    }
  }

  checkPressedButton(event) {
    this.savannahState.isAnswered = true;
    const keyPressed = event.key;
    if (['1', '2', '3', '4'].includes(keyPressed)) {
      const selectedAnswer = this.answersArea.querySelectorAll('.game__answer')[Number(keyPressed) - 1];
      const selectedAnswerID = selectedAnswer.getAttribute('id');
      if (!Number(selectedAnswerID)) {
        this.catchCorrectAnswer();
      } else {
        this.catchWrongAnswer();
      }
    }
  }

  setEventListeners() {
    this.answersArea.addEventListener('click', (event) => this.checkClickedAnswer(event));
    document.body.addEventListener('keydown', (event) => this.checkPressedButton(event));
  }

  catchCorrectAnswer() {
    const sound = '/src/sass/blocks/Savannah/answer-correct.mp3';
    ProceedAnswer.audioPlay(sound);
    this.savannahState.answeredCorrect.push(this.savannahState.activeWordID);
    this.continueGame();
  }

  catchWrongAnswer() {
    if (this.savannahState.answeredWrong.length < 6) {
      const sound = '/src/sass/blocks/Savannah/answer-wrong.mp3';
      ProceedAnswer.audioPlay(sound);
      this.savannahState.answeredWrong.push(this.savannahState.activeWordID);
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
