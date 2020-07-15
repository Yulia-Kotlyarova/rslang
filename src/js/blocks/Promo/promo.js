import '../../../sass/styles.scss';
import 'bootstrap/js/dist/collapse';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faGithubSquare,
} from '@fortawesome/fontawesome-free-brands';

import Header from '../../modules/Header';
import MessageModal from '../../modules/MessageModal';

library.add(faGithubSquare);
dom.watch();

const cursorSpan = document.querySelector('.cursor');

class TypeWriter {
  constructor(txtElement, words, wait = 2000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
  }

  type() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];
    cursorSpan.classList.add('typing');
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    let typeSpeed = 300;

    if (this.isDeleting) {
      typeSpeed /= 2;
      cursorSpan.classList.add('typing');
    }
    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
      cursorSpan.classList.remove('typing');
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.wordIndex += 1;
      typeSpeed = this.wait;
      cursorSpan.classList.remove('typing');
    }
    setTimeout(() => this.type(), typeSpeed);
  }
}

function init() {
  const txtElement = document.querySelector('.txt-type');
  const words = JSON.parse(txtElement.getAttribute('data-words'));
  const wait = txtElement.getAttribute('data-wait');
  // eslint-disable-next-line no-unused-vars
  const typeWriter = new TypeWriter(txtElement, words, wait);
}

window.onload = () => {
  const messageModal = new MessageModal();
  messageModal.appendSelf('unauthorized__modal');

  const { hash } = window.location;

  if (hash === '#unauthorized') {
    const language = localStorage.getItem('app-language');
    if (language === 'ru') {
      MessageModal.showModal('Что-то пошло не так. Вы зарегистрировались?', undefined, 'unauthorized__modal');
    } else {
      MessageModal.showModal('Sorry, something went wrong. Did you log in?', undefined, 'unauthorized__modal');
    }
    window.location.hash = '';
  }

  init();
  const header = new Header();
  header.run();
};
