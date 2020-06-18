/* eslint-disable class-methods-use-this */
export default class ProceedAnswer {
  constructor(savannahState) {
    this.savannahState = savannahState;
  }

  checkAnswer(event) {
    if (event.type === 'keydown') {
      event.preventDefault();
      // console.log(event);
      const keyPressed = event.key;
      if (['1', '2', '3', '4'].includes(keyPressed)) {
        // const answers = document.querySelectorAll('.game__answer');
        const selectedAnswer = document.getElementById(Number(keyPressed) - 1).lastChild.innerText;
        // console.log(selectedAnswer);
        const temp = this.savannahState;
        const correctAnswer = temp.wordsCollection[temp.wordsOrder[temp.activeWord]].wordTranslate;
        if (selectedAnswer === correctAnswer) {
          // console.log('correct');
        } else {
          // console.log('wrong');
        }
      }
    } else {
      const clickedWordID = event.target.closest('.game__answer').getAttribute('id');
      if (!Number(clickedWordID)) {
        // console.log('correct');
      } else {
        // console.log('wrong');
      }
    }
  }
}
