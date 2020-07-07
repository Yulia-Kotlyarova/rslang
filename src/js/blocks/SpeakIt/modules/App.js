class App {
  setMainPage(mainPage) {
    this.mainPage = mainPage;
    this.api = 'https://afternoon-falls-25894.herokuapp.com/words';
  }

  setStartScreen(startScreen) {
    this.startScreen = startScreen;
  }

  setGame(game) {
    this.game = game;
  }

  setRec(rec) {
    this.rec = rec;
  }

  setResult(result) {
    this.result = result;
  }

  async getWords(page, group) {
    const url = `${this.api}?page=${page}&group=${group}`;
    const res = await fetch(url);
    const json = await res.json();
    return json;
  }

  async getRandomPageWords(group) {
    const page = Math.floor(Math.random() * (29 + 1));
    const json = await this.getWords(page, group);
    return json;
  }

  async render(page, level) {
    if (page === 'mainPage') {
      if (level || level === 0) {
        this.level = level;
        this.wordsData = await this.getRandomPageWords(level);
      }
      this.mainPage.render(this.wordsData);
      this.startScreen.hide();
    } else if (page === 'result') {
      this.result.render();
      this.startScreen.hide();
    }
  }

  async initiate() {
    this.wordsData = await this.getRandomPageWords(0);

    window.addEventListener('beforeunload', () => {
      this.game.finish();
    });
    window.addEventListener('unload', () => {
      this.game.finish();
    });
  }
}

export default App;
