import Quiz from './scrCode7TestController';
import Question from './scrCode6Test';

const questions = [
  new Question('What color is a tomato?', ['Yellow', 'Red', 'Brown', 'Green'], 'Red'),
  new Question('I  _____  the coffee on the table', ['spilled', 'anger', 'motion', 'swim'], 'spilled'),
  new Question('An  _____ is a formal decision about future action', ['arise', 'exceed', 'agreement', 'satisfaction'], 'agreement'),
  new Question('How large is dust?', ['substantially', 'grind', 'outrage', 'very small']),
  new Question('If someone is  _____  of something, then they are aware of it', ['conscious', 'eventual', 'immense', 'fun'], 'conscious'),
  new Question('To  _____  means to sparkle and shine.', ['flourish', 'enlighten', 'gleam', 'dwell'], 'gleam'),
];
const testContainer = document.querySelector('.test');
const quiz = new Quiz(questions);

const closeTest = () => {
  const clsTest = document.getElementsByClassName('testClose')[0];
  clsTest.addEventListener('click', () => {
    testContainer.classList.add('testHidden');
  });
};

const startTest = () => {
  const startButton = document.querySelector('.take-test');
  startButton.addEventListener('click', () => {
    testContainer.classList.remove('testHidden');
  });
};

const showScores = () => {
  let gameOverHtml = '<h2>Result</h2>';
  gameOverHtml += `<h3 id='score'> Твой уровень: ${quiz.score}</h3>
  <span class="testClose">&times;</span>`;
  const element = document.querySelector('.test');
  element.innerHTML = gameOverHtml;
  closeTest();
};

const showProgress = () => {
  const currentQuestionNumber = quiz.questionIndex + 1;
  const currentProgress = document.getElementById('progress');
  currentProgress.innerHTML = `Question ${currentQuestionNumber} of ${quiz.questions.length}`;
};

function populate() {
  if (quiz.isEnded()) {
    showScores();
  } else {
    const element = document.getElementById('test__question');
    element.innerHTML = quiz.getQuestionIndex().text;

    // show choices
    const { choices } = quiz.getQuestionIndex();
    for (let i = 0; i < choices.length; i += 1) {
      const getChoice = document.getElementById(`choice${i}`);
      getChoice.innerHTML = choices[i];
      // eslint-disable-next-line no-use-before-define
      guess(`btn${i}`, choices[i]);
    }
    showProgress();
  }
}

const guess = (id, gue) => {
  const button = document.getElementById(id);
  button.onclick = () => {
    quiz.guess(gue);
    populate();
  };
};
closeTest();

populate();

export default startTest;
