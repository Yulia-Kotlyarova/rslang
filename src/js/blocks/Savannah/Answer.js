export default class Answer {
  constructor(answerOrder, answerID, savannahState) {
    this.savannahState = savannahState;
    this.answerID = answerID;
    this.answerOrder = answerOrder;
  }

  createAnswerCard() {
    const temp = this.savannahState;
    const activeWord = temp.wordAndAnswers[temp.activeWord][this.answerID];
    const word = activeWord[1].wordTranslate;
    const answerCard = document.createElement('div');
    const answerNumber = `<span class="game__answer-number">${this.answerOrder}.</span>`;
    const answerWord = `<span class="game__answer-word">${word}</span>`;
    answerCard.setAttribute('id', this.answerID);
    answerCard.classList.add('game__answer');
    answerCard.innerHTML = `${answerNumber} ${answerWord}`;
    return answerCard;
  }
}
