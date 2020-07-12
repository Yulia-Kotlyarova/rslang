import '../../../sass/styles.scss';

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
  init();
};
