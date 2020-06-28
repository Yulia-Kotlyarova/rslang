// eslint-disable-next-line no-unused-vars
import { divide } from 'lodash';
import '../../../sass/styles.scss';
import { objForCorrectWord, objForInCorrectWord } from './sprintGame';
import Repository from '../../modules/Repository';

const simpleModel = document.getElementById('simpleModal');
const closeBtn = document.getElementsByClassName('closeBtn')[0];
const errorCount = document.getElementById('modal-content__body-error-count');
const correctCount = document.getElementById('modal-content__body-correct-count');

function disableKey() {
  document.addEventListener('keydown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.returnValue = false;
    e.cancelBubble = true;
    return false;
  }, false);
}

const addWordsToStatistic = (array, array1, array2) => {
  const list = document.createElement('ul');
  for (let i = 0; i < array1.length; i += 1) {
    const item = document.createElement('li');
    item.innerHTML = `<button onclick="uclicked('${array[i]}')"><i class="fas fa-volume-down"></i></button> `;
    item.appendChild(document.createTextNode(`${array1[i]} - ${array2[i]}`));
    list.appendChild(item);
  }
  return list;
};

const openModal = async () => {
  simpleModel.style.display = 'block';
  disableKey();
  errorCount.textContent = objForInCorrectWord.eng.length;
  correctCount.textContent = objForCorrectWord.eng.length;
  document.querySelector('.modal-content__body-correct').appendChild(addWordsToStatistic(objForCorrectWord.audio, objForCorrectWord.eng, objForCorrectWord.ru));
  document.querySelector('.modal-content__body-error').appendChild(addWordsToStatistic(objForInCorrectWord.audio, objForInCorrectWord.eng, objForInCorrectWord.ru));
  console.log('this is updateOptionalStatistics');
  await Repository.updateOptionalStatistics(objForCorrectWord.eng);
  console.log('this getStatistics');
  console.log(await Repository.getStatistics());
  console.log('this is getAllUserWords');
  console.log(await Repository.getAllUserWords('0', '10'));
  console.log('this is incrementLearnedWords');
  await Repository.incrementLearnedWords();
};

export { openModal as default };

const closeModal = () => {
  closeBtn.addEventListener('click', () => {
    simpleModel.style.display = 'none';
  });
};

const outsideClick = () => {
  window.addEventListener('click', (e) => {
    if (e.target === simpleModel) {
      simpleModel.style.display = 'none';
    }
  });
};

window.addEventListener('load', () => {
  closeModal();
  outsideClick();
});
