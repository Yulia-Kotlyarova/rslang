import shuffle from 'lodash/shuffle';

import Repository from '../../../modules/Repository';

import MessageModal from '../../../modules/MessageModal';

class App {
  setMainPage(mainPage) {
    this.mainPage = mainPage;

    this.levelsElement = document.querySelector('.levels');

    this.selectWordsElement = document.querySelector('.select-words');
    this.userWords = true;

    this.selectPageElement = document.querySelector('.user-words-page');
    this.selectedPage = '1';

    this.level = '0';
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

  async getWords() {
    let words;

    try {
      if (this.userWords) {
        words = await Repository.getAllUserWords(undefined, 10);
        return words;
      }
      words = await Repository
        .getWordsFromGroupAndPage(this.mainPage.level, Number(this.selectedPage) - 1);

      return shuffle(words);
    } catch (e) {
      MessageModal.showModal(`Cannot get words' data from server. Error: '${e.message}'.`);
      return [];
    }
  }

  async render(page, level) {
    if (page === 'mainPage') {
      if (level || level === 0) {
        this.level = level;
        this.wordsData = await this.getWords(level);
      }
      this.mainPage.show();
      this.mainPage.render(this.wordsData);
      this.startScreen.hide();
      this.result.hide();
    } else if (page === 'result') {
      this.startScreen.hide();
      this.mainPage.hide();
      this.result.render();
    }
  }

  async initiate() {
    this.wordsData = await this.getWords();

    window.addEventListener('beforeunload', async () => {
      await this.game.finish();
    });
    window.addEventListener('unload', async () => {
      await this.game.finish();
    });

    this.selectPageElement.addEventListener('change', async () => {
      if (Number(this.selectPageElement.value) < 1) {
        this.selectPageElement.value = '1';
      } else if (Number(this.selectPageElement.value) > 30) {
        this.selectPageElement.value = '30';
      }

      this.selectedPage = this.selectPageElement.value;

      await this.game.finish();
      this.mainPage.displayWord('img/blank.jpg');
      this.mainPage.translationDisplay.innerText = '';

      await this.render('mainPage', this.level);
    });

    this.selectWordsElement.addEventListener('click', async () => {
      if (this.userWords) {
        this.selectWordsElement.classList.add('select-words__turned-off');
        this.selectPageElement.classList.remove('user-words-page__hidden');
        this.levelsElement.classList.remove('levels__hidden');

        this.userWords = false;
      } else {
        this.selectWordsElement.classList.remove('select-words__turned-off');
        this.selectPageElement.classList.add('user-words-page__hidden');
        this.levelsElement.classList.add('levels__hidden');

        this.userWords = true;
      }

      await this.render('mainPage', this.level);
    });
  }
}

export default App;
