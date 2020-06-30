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

  finish() {
    this.app.mainPage.stopListening();
    this.app.rec.recognition.stop();
    this.updateGamesInStorage();
    this.game = {};
  }

  updateGamesInStorage() {
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

    const now = new Date();

    games.push({
      date: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`,
      errors: this.game.guessed ? (10 - this.game.guessed) : 10,
      guessed: this.game.guessed || 0,
      level: this.app.level || 0,
    });
    localStorage.setItem('speakit-games', JSON.stringify(games));
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
