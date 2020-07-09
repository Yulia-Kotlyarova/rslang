import Repository from '../../../modules/Repository';

import getTodayShort from '../../../helpers';

class Game {
  constructor(app) {
    this.game = {};
    this.app = app;
  }

  start() {
    this.app.mainPage.startListening();
    this.app.rec.recognition.start();
    this.game.on = true;
  }

  async finish() {
    this.app.mainPage.stopListening();
    this.app.rec.recognition.stop();
    await this.updateGamesInStorage();
    this.game = {};
  }

  async updateGamesInStorage() {
    if (!this.game.on) {
      return;
    }

    const gamesJSON = localStorage.getItem('speakit-games');
    let games;

    if (gamesJSON) {
      games = JSON.parse(gamesJSON);
    } else {
      games = [];
    }

    const gameSessionData = {
      date: getTodayShort(),
      errors: Number(this.game.guessed) ? (10 - Number(this.game.guessed)) : 10,
      guessed: this.game.guessed || 0,
    };

    if (this.app.userWords) {
      gameSessionData.useOnlyUserWords = true;
    } else {
      gameSessionData.level = this.app.level || 0;
    }

    games.push(gameSessionData);
    localStorage.setItem('speakit-games', JSON.stringify(games));

    await Promise.all([...this.app.mainPage.cardsElement.children].map(
      (wordElement) => {
        if (wordElement.classList.contains('card_active')) {
          return Repository.saveWordResult({ wordId: wordElement.dataset.id, result: '2' });
        }
        return Repository.saveWordResult({ wordId: wordElement.dataset.id, result: '0' });
      },
    ));

    await Repository.saveGameResult('speakit', !!gameSessionData.errors, gameSessionData);
  }

  compareWords(word) {
    const cardData = this.app.mainPage.cards[word.toLowerCase().trim()];

    if (cardData) {
      cardData.cardElement.classList.add('card_active');

      this.app.mainPage.activeCards.push(cardData.cardElement);
      this.app.mainPage.displayWord(cardData.image);
      this.app.mainPage.addStar();

      cardData.guessed = true;

      if (!this.game.guessed) this.game.guessed = 0;
      this.game.guessed += 1;
    }

    if (this.game.guessed === 10) {
      this.app.result.render();
    }
  }
}

export default Game;
