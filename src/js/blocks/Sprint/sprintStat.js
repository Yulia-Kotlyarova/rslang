import { objForCorrectWord, objForInCorrectWord } from './sprintGame';
import Repository from '../../modules/Repository';

const simpleModel = document.getElementById('simpleModal');
const closeBtn = document.getElementsByClassName('closeBtn')[0];
const errorCount = document.getElementById('modal-content__body-error-count');
const correctCount = document.getElementById('modal-content__body-correct-count');

function disableKey() {
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 37 || e.keyCode === 39) {
      e.stopPropagation();
      e.preventDefault();
      e.returnValue = false;
      e.cancelBubble = true;
    }
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

const openModal = () => {
  simpleModel.classList.add('d-block');
  disableKey();
  errorCount.textContent = objForInCorrectWord.eng.length;
  correctCount.textContent = objForCorrectWord.eng.length;
  document.querySelector('.modal-content__body-correct').appendChild(addWordsToStatistic(objForCorrectWord.audio, objForCorrectWord.eng, objForCorrectWord.ru));
  document.querySelector('.modal-content__body-error').appendChild(addWordsToStatistic(objForInCorrectWord.audio, objForInCorrectWord.eng, objForInCorrectWord.ru));
};

export { openModal as default };

const closeModal = () => {
  closeBtn.addEventListener('click', () => {
    simpleModel.style.display = 'none';
    simpleModel.classList.remove('d-block');
    objForCorrectWord.id.forEach((val) => {
      Repository.saveWordResult({ wordId: val, result: '2' });
    });
    objForInCorrectWord.id.forEach((val) => {
      Repository.saveWordResult({ wordId: val, result: '0' });
    });
  });
};

const outsideClick = () => {
  window.addEventListener('click', (e) => {
    if (e.target === simpleModel) {
      simpleModel.style.display = 'none';
      simpleModel.classList.remove('d-block');
    }
  });
};

window.addEventListener('load', () => {
  closeModal();
  outsideClick();
});
