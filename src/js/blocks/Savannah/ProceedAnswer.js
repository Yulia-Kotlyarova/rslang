import Results from './Results';
import Repository from '../../modules/Repository';
import { heartFill, heartStroke } from './consts';
import { savannahSettings } from './appState';
import getTodayShort from '../../helpers';

export default class ProceedAnswer {
  constructor(savannahState, startNewRound, startNewGame) {
    this.savannahState = savannahState;
    this.startNewRound = startNewRound;
    this.startNewGame = startNewGame;
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
    clearInterval(this.savannahState.timerId);
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

    const currentWordId = this.savannahState.wordsCollection[this.savannahState.activeWordID].id;
    Repository.saveWordResult({ wordId: currentWordId, result: '2' });
    ProceedAnswer.updateStatistics(1, 0, this.savannahState); // no await - it slows down

    if (savannahSettings.soundOn) {
      const sound = 'Right-answer-ding-ding-sound-effect.mp3';
      ProceedAnswer.audioPlay(sound);
    }
    this.savannahState.answeredCorrect.push(this.savannahState.activeWordID);
    setTimeout(() => {
      this.continueGame();
    }, 1000);
  }

  catchWrongAnswer(selectedAnswer) {
    const currentWordId = this.savannahState.wordsCollection[this.savannahState.activeWordID].id;
    Repository.saveWordResult({ wordId: currentWordId, result: '0' });
    ProceedAnswer.updateStatistics(0, 1, this.savannahState); // no await - it slows down
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
      if (savannahSettings.soundOn) {
        const sound = 'error.wav';
        ProceedAnswer.audioPlay(sound);
      }
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
        const results = new Results(this.startNewGame, this.savannahState);
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

  static async updateStatistics(correct, wrong, savannahState) {
    const savannahStatistic = JSON.parse(localStorage.getItem('savannahStatistic'));
    if (savannahState.userWords) {
      if (savannahStatistic[`level_${savannahState.userWordsLevel}`] && savannahState.activeWord !== 0) {
        let [correctAnswers, wrongAnswers, date] = savannahStatistic[`level_${savannahState.userWordsLevel}`];
        correctAnswers += correct;
        wrongAnswers += wrong;
        date = getTodayShort();
        savannahStatistic[`level_${savannahState.userWordsLevel}`] = [correctAnswers, wrongAnswers, date];
      } else {
        savannahStatistic[`level_${savannahState.userWordsLevel}`] = [correct, wrong, getTodayShort()];
      }
      localStorage.setItem('savannahStatistic', JSON.stringify(savannahStatistic));
      Repository.saveGameResult('savannah', null, null, savannahStatistic);
    } else {
      if (savannahStatistic[`${savannahState.currentLevel}.${savannahState.currentRound}`] && savannahState.activeWord !== 0) {
        let [correctAnswers, wrongAnswers, date] = savannahStatistic[`${savannahState.currentLevel}.${savannahState.currentRound}`];
        correctAnswers += correct;
        wrongAnswers += wrong;
        date = getTodayShort();
        savannahStatistic[`${savannahState.currentLevel}.${savannahState.currentRound}`] = [correctAnswers, wrongAnswers, date];
      } else {
        savannahStatistic[`${savannahState.currentLevel}.${savannahState.currentRound}`] = [correct, wrong, getTodayShort()];
      }
      localStorage.setItem('savannahStatistic', JSON.stringify(savannahStatistic));
      Repository.saveGameResult('savannah', null, null, savannahStatistic);
    }
  }
}
