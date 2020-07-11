import arrayShuffle from 'lodash/_arrayShuffle';
import Answer from './Answer';
import ProceedAnswer from './ProceedAnswer';

export default class StartNewRound {
  constructor(savannahState) {
    this.savannahState = savannahState;
    this.answersArea = document.querySelector('.game__answers');
    this.activeWordContainer = document.querySelector('.game__active-word');
    this.wordsCounterContainer = document.querySelector('.savannah__game__words-counter');
    this.isAnswered = false;
    this.timerId = 0;
    this.wordLimit = 0;
  }

  startRound() {
    clearInterval(this.savannahState.timerId);
    this.wordsCounterContainer.innerText = 20 - this.savannahState.activeWord;
    this.wordLimit = this.answersArea.getBoundingClientRect().top;
    this.returnActiveWordPosition();
    this.distributeAnswers();
    this.displayActiveWord();
    this.savannahState.timerId = setInterval(this.moveDownActiveWord.bind(this), 10);
  }

  returnActiveWordPosition() {
    this.activeWordContainer.style.top = '-150px';
  }

  distributeAnswers() {
    this.answersArea.innerHTML = '';
    const arr = StartNewRound.shuffleArray();
    for (let i = 0; i < arr.length; i += 1) {
      const answerID = arr[i];
      const answerOrder = i + 1;
      const answer = new Answer(answerOrder, answerID, this.savannahState);
      this.answersArea.append(answer.createAnswerCard());
    }
  }

  displayActiveWord() {
    const temp = this.savannahState;
    const activeWord = temp.wordsCollection[temp.wordsOrder[temp.activeWord]].word;
    this.activeWordContainer.innerText = activeWord;
    this.savannahState.isAnswered = false;
    this.savannahState.activeWordID = temp.wordsOrder[temp.activeWord];
  }

  moveDownActiveWord() {
    const fromTop = this.activeWordContainer.offsetTop;
    if (fromTop < 200 && !this.savannahState.isAnswered) {
      this.activeWordContainer.style.top = `${fromTop + 1}px`;
    } else {
      this.savannahState.isAnswered = true;
      clearInterval(this.savannahState.timerId);
      const proceedAnswer = new ProceedAnswer(this.savannahState, this);
      proceedAnswer.catchWrongAnswer();
    }
  }

  static shuffleArray() {
    const arr = [...Array(4).keys()];
    return arrayShuffle(arr);
  }
}
