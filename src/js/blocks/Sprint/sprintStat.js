// eslint-disable-next-line no-unused-vars
import { divide } from 'lodash';
import '../../../sass/styles.scss';

const simpleModel = document.getElementById('simpleModal');
const closeBtn = document.getElementsByClassName('closeBtn')[0];

const openModal = () => {
  simpleModel.style.display = 'block';
  document.onkeydown = (e) => {
    e.preventDefault();
  };
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
