import Card from './Card';

import templates from '../templates/templates';

class MainPage {
  constructor(mainPageElement, app) {
    this.mainPageElement = mainPageElement;
    this.app = app;

    this.cardsElement = this.mainPageElement.querySelector('.cards');
    this.displayImage = this.mainPageElement.querySelector('.display__image');
    this.restartButton = this.mainPageElement.querySelector('.controls__restart');
    this.speakButton = this.mainPageElement.querySelector('.controls__speak');
    this.resultButton = this.mainPageElement.querySelector('.controls__result');

    this.levels = this.mainPageElement.querySelector('.levels');
    this.levelZero = this.mainPageElement.querySelector('.levels__level');
    this.score = this.mainPageElement.querySelector('.score');

    this.translationDisplay = this.mainPageElement.querySelector('.display__translation');

    this.inputDisplay = this.mainPageElement.querySelector('.display__input');
  }

  hide() {
    this.mainPageElement.classList.add('results_hide');
  }

  show() {
    this.mainPageElement.classList.remove('results_hide');
  }

  startListening() {
    if (this.activeCards && this.activeCards.length) {
      this.activeCards.forEach((card) => {
        card.classList.remove('card_active');
      });
    }
    this.activeCards = [];
    this.translationDisplay.classList.add('display__translation_hide');
    this.inputDisplay.classList.remove('display__input_hide');
  }

  stopListening() {
    this.translationDisplay.classList.remove('display__translation_hide');
    this.inputDisplay.classList.add('display__input_hide');
    this.inputDisplay.setAttribute('value', '');
    this.removeStars();
  }

  addStar() {
    const star = templates.star();
    this.score.appendChild(star);
  }

  removeStars() {
    this.score.innerHTML = '';
  }

  activateLevel(levelElement) {
    if (this.activeLevel) {
      this.activeLevel.classList.remove('levels__level_active');
    }
    levelElement.classList.add('levels__level_active');
    this.activeLevel = levelElement;
  }

  activateCard(cardElement) {
    if (this.activeCards && this.activeCards.length) {
      this.activeCards.forEach((card) => {
        card.classList.remove('card_active');
      });
    }
    this.activeCards = [];
    cardElement.classList.add('card_active');
    this.activeCards.push(cardElement);
  }

  displayWord(image) {
    this.displayImage.setAttribute('src', image);
  }

  showTranslation(card) {
    const { translation } = card;
    this.translationDisplay.innerText = translation;
  }

  renderWords(wordsData) {
    this.cards = {};
    const cardsFragment = document.createDocumentFragment();

    wordsData.forEach((word, index) => {
      if (index > 9) {
        return;
      }

      const card = new Card(word);
      cardsFragment.appendChild(card.cardElement);
      this.cards[word.word.toLowerCase()] = card;
    });

    this.cardsElement.innerHTML = '';
    this.cardsElement.appendChild(cardsFragment);
  }

  initiate() {
    this.activateLevel(this.levelZero);

    this.cardsElement.addEventListener('click', async (event) => {
      const cardElement = event.target.closest('.card');
      if (!cardElement || this.app.game.game.on) {
        return;
      }

      const card = this.cards[cardElement.dataset.word.toLowerCase()];

      card.playPronunciation();

      this.activateCard(cardElement);
      this.displayWord(card.image);
      this.showTranslation(card);
    });

    this.levels.addEventListener('click', async (event) => {
      const levelElement = event.target.closest('.levels__level');
      if (!levelElement) {
        return;
      }

      const { level } = levelElement.dataset;

      this.app.game.finish();
      this.activateLevel(levelElement);
      this.displayWord('img/blank.jpg');
      this.translationDisplay.innerText = '';

      await this.app.render('mainPage', level);
    });

    this.restartButton.addEventListener('click', async () => {
      this.app.game.finish();
      this.activateLevel(this.levelZero);
      this.displayWord('img/blank.jpg');
      this.translationDisplay.innerText = '';

      await this.app.render('mainPage', 0);
    });

    this.speakButton.addEventListener('click', () => {
      if (!this.app.game.game.on) {
        this.app.game.start();
      }
    });

    this.resultButton.addEventListener('click', async () => {
      await this.app.render('result');
    });
  }

  render(wordsData) {
    this.renderWords(wordsData);
  }
}

export default MainPage;
