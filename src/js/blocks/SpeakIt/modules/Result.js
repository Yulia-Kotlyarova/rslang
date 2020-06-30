import templates from '../templates/templates';

class Result {
  constructor(resultElement, app) {
    this.app = app;
    this.resultElement = resultElement;

    this.errorsCount = this.resultElement.querySelector('.field__count_errors');
    this.successCount = this.resultElement.querySelector('.field__count_correct');
    this.cardsErrorsContainer = this.resultElement.querySelector('.results__cards_errors');
    this.cardsSuccessContainer = this.resultElement.querySelector('.results__cards_success');
    this.returnButton = this.resultElement.querySelector('.button_return');
    this.newGameButton = this.resultElement.querySelector('.button_new-game');

    this.gamesPlayedList = this.resultElement.querySelector('.games-played__list');
  }

  hide() {
    this.resultElement.classList.add('results_hide');
  }

  show() {
    this.resultElement.classList.remove('results_hide');
  }

  render() {
    this.cardsSuccessContainer.innerHTML = '';
    this.cardsErrorsContainer.innerHTML = '';
    this.gamesPlayedList.innerHTML = '';

    const cardsSuccessFragment = document.createDocumentFragment();
    const cardsErrorsFragment = document.createDocumentFragment();
    const gamesFragment = document.createDocumentFragment();

    let errors = 0;
    let successes = 0;

    const { cards } = this.app.mainPage;

    Object.keys(cards).forEach((key) => {
      const card = cards[key].cardElement.cloneNode(true);
      card.classList.add('card_result');

      card.querySelector('.card__translation').innerText = cards[key].translation;

      if (cards[key].guessed) {
        successes += 1;
        cardsSuccessFragment.appendChild(card);
      } else {
        errors += 1;
        cardsErrorsFragment.appendChild(card);
      }
    });

    const gamesJSON = localStorage.getItem('speakit-games');
    if (!gamesJSON) {
      return;
    }

    const games = JSON.parse(gamesJSON);

    games.forEach((game) => {
      const gameItem = templates.gameItem(game);
      gamesFragment.appendChild(gameItem);
    });

    this.successCount.innerText = successes;
    this.errorsCount.innerText = errors;

    this.cardsSuccessContainer.appendChild(cardsSuccessFragment);
    this.cardsErrorsContainer.appendChild(cardsErrorsFragment);
    this.gamesPlayedList.appendChild(gamesFragment);

    this.show();
  }

  initiate() {
    this.returnButton.addEventListener('click', () => {
      this.hide();
    });

    this.newGameButton.addEventListener('click', async () => {
      this.app.game.finish();
      this.app.mainPage.activateLevel(this.app.mainPage.levelZero);
      this.app.mainPage.displayWord('img/blank.jpg');
      this.app.mainPage.translationDisplay.innerText = '';
      this.app.mainPage.stopListening();

      await this.app.render('mainPage', 0);

      this.hide();
    });

    this.resultElement.addEventListener('click', async (event) => {
      const cardElement = event.target.closest('.card');
      if (!cardElement) {
        return;
      }

      const card = this.app.mainPage.cards[cardElement.dataset.word.toLowerCase()];
      card.playPronunciation();
    });
  }
}

export default Result;
