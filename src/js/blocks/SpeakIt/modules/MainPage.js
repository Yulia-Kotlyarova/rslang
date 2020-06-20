import Card from './Card';
import apiKeys from '../../../constants/api-keys';

class MainPage {
  constructor(mainPageElement, app) {
    this.mainPageElement = mainPageElement;
    this.app = app;

    this.cardsElement = this.mainPageElement.querySelector('.cards');
    this.cardTemplate = this.mainPageElement.querySelector('.card');
    this.displayImage = this.mainPageElement.querySelector('.display__image');
    this.restartButton = this.mainPageElement.querySelector('.controls__restart');
    this.speakButton = this.mainPageElement.querySelector('.controls__speak');
    this.resultButton = this.mainPageElement.querySelector('.controls__result');

    this.levels = this.mainPageElement.querySelector('.levels');
    this.levelZero = this.mainPageElement.querySelector('.levels__level');
    this.starTemplate = this.mainPageElement.querySelector('.star');
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
    const star = this.starTemplate.cloneNode(true);
    star.classList.remove('star_hide');
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

  // eslint-disable-next-line class-methods-use-this
  playPronunciation(cardData) {
    new Audio(cardData.audio).play();
  }

  // eslint-disable-next-line class-methods-use-this
  async getTranslation(word) {
    const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${apiKeys.KEY}&text= ${word} &lang=en-ru`;
    const res = await fetch(url);
    const data = await res.json();
    return data.text[0];
  }

  // eslint-disable-next-line class-methods-use-this
  async showTranslation(cardData) {
    let { translation } = cardData;
    if (!translation) {
      translation = await this.getTranslation(cardData.word);
    }
    this.translationDisplay.innerText = translation;
    this.cards[cardData.word.toLowerCase().trim()].translation = translation;
  }

  renderWords(wordsData) {
    this.cards = {};
    const cardsFragment = document.createDocumentFragment();

    wordsData.forEach((word, index) => {
      if (index > 9) return;
      const card = new Card(this.cardTemplate, word);
      cardsFragment.appendChild(card.cardElement);
      this.cards[word.word.toLowerCase().trim()] = card;
    });

    this.cardsElement.innerHTML = '';
    this.cardsElement.appendChild(cardsFragment);
  }

  initiate() {
    this.activateLevel(this.levelZero);

    this.cardsElement.addEventListener('click', async (event) => {
      const card = event.target.closest('.card');
      if (!card || this.app.game.game.on) return;

      const cardData = this.cards[card.dataset.word.toLowerCase().trim()];

      this.activateCard(card);
      this.playPronunciation(cardData);
      this.displayWord(cardData.image);
      await this.showTranslation(cardData);
    });

    this.levels.addEventListener('click', async (event) => {
      const levelElement = event.target.closest('.levels__level');
      if (!levelElement) return;

      const { level } = levelElement.dataset;

      this.activateLevel(levelElement);
      this.displayWord('img/blank.jpg');
      this.app.game.finish();
      await this.app.render('mainPage', level);
      this.translationDisplay.innerText = '';
    });

    this.restartButton.addEventListener('click', () => {
      this.displayWord('img/blank.jpg');
      this.translationDisplay.innerText = '';
      this.app.game.finish();
      this.app.render('mainPage', 0);
      this.activateLevel(this.levelZero);
    });

    this.speakButton.addEventListener('click', () => {
      if (!this.app.game.game.on) {
        this.app.game.start();
      }
    });

    this.resultButton.addEventListener('click', () => {
      this.app.render('result');
    });
  }

  render(wordsData) {
    this.renderWords(wordsData);
  }
}

export default MainPage;
