import Answer from './Answer';

export default class StartNewRound {
  constructor(savannahState) {
    this.savannahState = savannahState;
    this.answersArea = document.querySelector('.game__answers');
    this.activeWordContainer = document.querySelector('.game__active-word');
    this.isAnswered = false;
  }

  startRound() {
    this.distributeAnswers();
    this.displayActiveWord();
    this.startMoveActiveWord();
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
  }

  startMoveActiveWord() {
    const fromTop = this.activeWordContainer.offsetTop;
    this.activeWordContainer.style.top = `${fromTop + 1}px`;
    if (fromTop < 500 && !this.savannahState.isAnswered) {
      setTimeout(() => {
        this.startMoveActiveWord();
      }, 10);
    }
  }

  static shuffleArray() {
    const arr = [0, 1, 2, 3];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    return arr;
  }
}
