import '../../../sass/styles.scss';
import '@fortawesome/fontawesome-free/js/all.min';

window.onload = () => {
};

class Card {
  constructor(word) {
    this.word = word;
    this.wordCount = 10;
    this.cardsCount = 10;
    this.card = document.querySelector('.word-card');
  }

  showWordInput() {
    const wordField = document.createElement('span');
    const checkWordButton = document.createElement('button');
    checkWordButton.classList.add('check');
    checkWordButton.innerText = 'Check';
    wordField.classList.add('word-wrapper');
    this.card.append(wordField, checkWordButton);
    const wordLength = this.word.length;
    for (let i = 0; i < wordLength; i += 1) {
      const letterContainer = document.createElement('span');
      letterContainer.innerText = this.word[i];
      letterContainer.classList.add('hidden');
      letterContainer.setAttribute('index', i);
      wordField.append(letterContainer);
    }
    const wordInput = document.createElement('input');
    wordInput.classList.add('word-field');
    wordInput.setAttribute('spellcheck', false);
    wordInput.setAttribute('autofocus', 'autofocus');
    wordField.append(wordInput);
  }

  checkWord() {
    const entryField = document.querySelector('.word-field');
    const hiddenRightWord = [...document.querySelectorAll('.word-wrapper span[index]')];
    const wordValue = entryField.value;
    if (this.word !== entryField.value) {
      for (let i = 0; i < hiddenRightWord.length; i += 1) {
        if (wordValue[i] === hiddenRightWord[i].textContent) {
          hiddenRightWord[i].classList.add('right-letter');
        } else {
          hiddenRightWord[i].classList.add('wrong-letter');
        }
      }
      entryField.value = '';
      hiddenRightWord.forEach((item) => {
        item.classList.remove('hidden');
      });
      setTimeout(() => {
        hiddenRightWord.forEach((item) => {
          item.classList.add('opacity');
        });
        entryField.focus();
      }, 1000);
    } else {
      entryField.classList.add('right-letter');
      // ToDo Next card
    }
  }

  setEventListener() {
    const checkWordButton = document.querySelector('.check');
    const entryField = document.querySelector('.word-field');

    checkWordButton.addEventListener('click', this.checkWord.bind(this));
    entryField.addEventListener('input', () => {
      const hiddenRightWord = [...document.querySelectorAll('.word-wrapper span[index]')];
      hiddenRightWord.forEach((item) => {
        const currentItem = item;
        currentItem.className = 'hidden';
      });
    });
    document.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        this.checkWord();
      }
    });
  }
}

const card = new Card('happy');
card.showWordInput();
card.setEventListener();
