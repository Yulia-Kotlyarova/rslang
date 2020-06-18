import Answer from './Answer';

export default class StartNewRound {
  constructor(savannahState) {
    this.savannahState = savannahState;
    this.answersArea = document.querySelector('.game__answers');
    this.activeWordContainer = document.querySelector('.game__active-word');
  }

  startRound() {
    this.distributeAnswers();
    this.displayActiveWord();
  }

  distributeAnswers() {
    this.answersArea.innerHTML = '';
    const arr = [2, 0, 3, 1]; // подумать
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
  }
}
