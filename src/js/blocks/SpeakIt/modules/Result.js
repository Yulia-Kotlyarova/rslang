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

    this.gameResultTemplate = this.resultElement.querySelector('.games-played__game');
    this.gamesPlayedList = this.resultElement.querySelector('.games-played__list');
  }

  hide() {
    this.resultElement.classList.add('results_hide');
  }

  show() {
    this.resultElement.classList.remove('results_hide');
  }

  async render() {
    this.show();

    this.cardsErrorsContainer.innerHTML = '';
    const cardsErrorsFragment = document.createDocumentFragment();
    this.cardsSuccessContainer.innerHTML = '';
    const cardsSuccessFragment = document.createDocumentFragment();

    let errors = 0;
    let successes = 0;

    const { cards } = this.app.mainPage;

    await Promise.all(Object.keys(cards).map(async (key) => {
      const card = cards[key].cardElement.cloneNode(true);
      card.classList.add('card_result');

      if (cards[key].translation) {
        card.querySelector('.card__translation').innerText = cards[key].translation;
      } else {
        const translation = await this.app.mainPage.getTranslation(cards[key].word);
        cards[key].translation = translation;
        card.querySelector('.card__translation').innerText = translation;
      }

      if (cards[key].guessed) {
        successes += 1;
        cardsSuccessFragment.appendChild(card);
      } else {
        errors += 1;
        cardsErrorsFragment.appendChild(card);
      }
    }));

    this.errorsCount.innerText = errors;
    this.successCount.innerText = successes;
    this.cardsErrorsContainer.appendChild(cardsErrorsFragment);
    this.cardsSuccessContainer.appendChild(cardsSuccessFragment);

    this.gamesPlayedList.innerHTML = '';
    const gamesJSON = localStorage.getItem('games');
    if (!gamesJSON) return;
    const games = JSON.parse(gamesJSON);
    const gamesFragment = document.createDocumentFragment();
    games.forEach((game) => {
      const gameItem = this.gameResultTemplate.cloneNode();
      gameItem.classList.remove('games-played__game_hide');
      gameItem.innerText = `${game.date}. Level: ${game.level}. Guessed: ${game.guessed}, not guessed: ${game.errors}.`;
      gamesFragment.appendChild(gameItem);
    });
    this.gamesPlayedList.appendChild(gamesFragment);
  }

  initiate() {
    this.returnButton.addEventListener('click', () => {
      this.hide();
    });

    this.newGameButton.addEventListener('click', () => {
      this.app.mainPage.displayWord('img/blank.jpg');
      this.app.mainPage.translationDisplay.innerText = '';
      this.app.game.finish();
      this.app.mainPage.stopListening();
      this.app.mainPage.activateLevel(this.app.mainPage.levelZero);
      this.app.render('mainPage', 0);
      this.hide();
    });

    this.resultElement.addEventListener('click', async (event) => {
      const card = event.target.closest('.card');
      if (!card) return;

      const cardData = this.app.mainPage.cards[card.dataset.word.toLowerCase().trim()];

      this.app.mainPage.playPronunciation(cardData);
    });
  }
}

export default Result;
