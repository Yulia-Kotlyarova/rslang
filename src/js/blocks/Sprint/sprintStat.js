// eslint-disable-next-line no-unused-vars
import { divide } from 'lodash';
import '../../../sass/styles.scss';
import { objForCorrectWord, objForInCorrectWord } from './sprintGame';

const simpleModel = document.getElementById('simpleModal');
const closeBtn = document.getElementsByClassName('closeBtn')[0];
// const incorrectWords = [];

function disableKey() {
  document.addEventListener('keydown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.returnValue = false;
    e.cancelBubble = true;
    return false;
  }, false);
}

const addWordsToStatistic = (array1, array2) => {
  const list = document.createElement('ul');
  for (let i = 0; i < array1.length; i += 1) {
    const item = document.createElement('li');
    item.appendChild(document.createTextNode(`${array1[i]} - ${array2[i]}`));
    list.appendChild(item);
  }
  return list;
};

const openModal = () => {
  simpleModel.style.display = 'block';
  disableKey();
  document.querySelector('.modal-content__body-correct').appendChild(addWordsToStatistic(objForCorrectWord.eng, objForCorrectWord.ru));
  document.querySelector('.modal-content__body-error').appendChild(addWordsToStatistic(objForInCorrectWord.eng, objForInCorrectWord.ru));
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
