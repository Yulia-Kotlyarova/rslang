import '../../../sass/styles.scss';
import '@fortawesome/fontawesome-free/js/all.min';

window.onload = () => {
};

class Card {
  constructor(word) {
    this.word = word;
    this.cardWrapper = document.querySelector('.card-wrapper');
    this.todayProgress = document.querySelector('.progress');
    this.todayStudiedWordsOutput = document.querySelector('.today-studied-words');
    this.availabelWordsToStudy = document.querySelector('.max-available-words');
    this.card = null;
    this.todayStudiedWords = (localStorage.getItem('todayStudiedWords')) ? localStorage.getItem('todayStudiedWords') : 0;
    this.numberOfWordsToStudy = 50;
  }

  showCard() {
    this.card = document.createElement('div');
    const checkWordButton = document.createElement('button');
    const nextCardButton = document.createElement('button');
    this.card.classList.add('word-card');
    this.todayProgress.setAttribute('max', this.numberOfWordsToStudy);
    this.todayProgress.setAttribute('value', this.todayStudiedWords);
    this.todayStudiedWordsOutput.innerText = this.todayStudiedWords;
    this.availabelWordsToStudy.innerText = this.numberOfWordsToStudy;
    checkWordButton.classList.add('check');
    checkWordButton.innerText = 'Check';
    nextCardButton.classList.add('next-card-btn', 'hidden');
    nextCardButton.innerText = 'Next';
    this.cardWrapper.prepend(this.card, checkWordButton, nextCardButton);
  }

  showWordInput() {
    console.log(this.card);
    const wordField = document.createElement('span');
    wordField.classList.add('word-wrapper');
    this.card.append(wordField);
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
      const nextCardButton = document.querySelector('.next-card-btn');

      nextCardButton.classList.remove('hidden');
      entryField.classList.add('right-letter');
      this.todayStudiedWords = Number(this.todayStudiedWords) + 1;
      localStorage.setItem('todayStudiedWords', this.todayStudiedWords);
    }
  }

  clearCard() {
    while (this.card.firstChild) {
      this.card.removeChild(this.card.firstChild);
    }
  }

  nextCard() {
    const nextCardButton = document.querySelector('.next-card-btn');
    nextCardButton.classList.add('hidden');
    this.todayProgress.setAttribute('value', this.todayStudiedWords);
    this.todayStudiedWordsOutput.innerText = this.todayStudiedWords;
    this.clearCard();
    this.showWordInput();
  }

  setEventListener() {
    const checkWordButton = document.querySelector('.check');
    const entryField = document.querySelector('.word-field');
    const nextCardButton = document.querySelector('.next-card-btn');
    console.log(entryField);
    checkWordButton.addEventListener('click', this.checkWord.bind(this));
    nextCardButton.addEventListener('click', this.nextCard.bind(this));
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
card.showCard();
card.showWordInput();
card.setEventListener();
