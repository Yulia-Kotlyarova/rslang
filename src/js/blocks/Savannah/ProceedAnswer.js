/* eslint-disable class-methods-use-this */
export default class ProceedAnswer {
  constructor(savannahState) {
    this.savannahState = savannahState;
    this.answersArea = document.querySelector('.game__answers');
  }

  checkClickedAnswer(event) {
    this.savannahState.isAnswered = true;
    const clickedAnswer = event.target.closest('.game__answer');
    if (clickedAnswer) {
      const clickedWordID = clickedAnswer.getAttribute('id');
      if (!Number(clickedWordID)) {
        // console.log('correct');
      } else {
        // console.log('wrong');
      }
    }
  }

  checkPresseButton(event) {
    event.preventDefault();
    this.savannahState.isAnswered = true;
    const keyPressed = event.key;
    if (['1', '2', '3', '4'].includes(keyPressed)) {
      const selectedAnswer = this.answersArea.querySelectorAll('.game__answer')[Number(keyPressed) - 1];
      const selectedAnswerID = selectedAnswer.getAttribute('id');
      if (!Number(selectedAnswerID)) {
        // console.log('correct');
      } else {
        // console.log('wrong');
      }
    }
  }

  setEventListeners() {
    this.answersArea.addEventListener('click', (event) => this.checkClickedAnswer(event));
    document.body.addEventListener('keydown', (event) => this.checkPresseButton(event));
  }
}
