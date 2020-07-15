import '../../../sass/styles.scss';
import 'bootstrap/js/dist/collapse';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faGithubSquare,
} from '@fortawesome/fontawesome-free-brands';

import Header from '../../modules/Header';

library.add(faGithubSquare);
dom.watch();

const cursorSpan = document.querySelector('.cursor');
const dataWordsRu = ['Викторин', 'Игр', 'Статей'];
const dataWordsEn = ['Quizzes', 'GAMES', 'articles'];
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

const txtElement = document.querySelector('.txt-type');
const wait = txtElement.getAttribute('data-wait');

function init(txt, word, time) {
  // eslint-disable-next-line no-unused-vars
  const typeWriter = new TypeWriter(txt, word, time);
}

const newLangChange = () => {
  if (localStorage.getItem('app-language') === 'ru') {
    init(txtElement, dataWordsRu, wait);
  }
  if (localStorage.getItem('app-language') === 'en') {
    init(txtElement, dataWordsEn, wait);
  }
};

window.onload = () => {
  const header = new Header();
  header.run();
  newLangChange();
};
