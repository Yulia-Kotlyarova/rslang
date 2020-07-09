import $ from 'jquery';
import keyBy from 'lodash/keyBy';

import Repository from '../../../modules/Repository';
import MessageModal from '../../../modules/MessageModal';

import templates from '../templates/templates';

class App {
  constructor() {
    this.dictionaryContainer = document.querySelector('.dictionary__container');
    this.dictionaryNav = document.querySelector('.dictionary__nav');

    this.wordsUserContainer = this.dictionaryContainer.querySelector('#words-user-tab');
    this.wordsHardContainer = this.dictionaryContainer.querySelector('#words-hard-tab');
    this.wordsDeletedContainer = this.dictionaryContainer.querySelector('#words-deleted-tab');

    this.wordsUserButton = document.querySelector('#dictionary-tab__user');
    this.wordsHardButton = document.querySelector('#dictionary-tab__hard');
    this.wordsDeletedButton = document.querySelector('#dictionary-tab__deleted');

    this.wordsUser = [];
    this.wordsHard = [];
    this.wordsDeleted = [];

    this.reloadOnHashChange = true;
  }

  async getWords() {
    this.words = await Repository.getAllUserWordsIncludingHardDeleted(3600);

    this.words.forEach((word) => {
      if (word.userWord && word.userWord.optional && word.userWord.optional.isHard) {
        this.wordsHard.push(word);
      } else if (word.userWord && word.userWord.optional && word.userWord.optional.isDeleted) {
        this.wordsDeleted.push(word);
      } else {
        this.wordsUser.push(word);
      }
    });

    this.wordsObject = keyBy(this.words, '_id');
  }

  populateWords() {
    const wordsUserFragment = document.createDocumentFragment();
    const wordsHardFragment = document.createDocumentFragment();
    const wordsDeletedFragment = document.createDocumentFragment();

    this.words.forEach((word) => {
      const wordElement = templates.word(word, this.settings);

      if (word.userWord && word.userWord.optional && word.userWord.optional.isHard) {
        wordElement.classList.add('dictionary__word_hard');
        wordsHardFragment.appendChild(wordElement);
      } else if (word.userWord && word.userWord.optional && word.userWord.optional.isDeleted) {
        wordElement.classList.add('dictionary__word_deleted');
        wordsDeletedFragment.appendChild(wordElement);
      } else {
        wordsUserFragment.appendChild(wordElement);
      }
    });

    const dictionaryTabUserStart = templates
      .dictionaryTabStart({ wordCount: wordsUserFragment.children.length, isUser: true });
    const dictionaryTabHardStart = templates
      .dictionaryTabStart({ wordCount: wordsHardFragment.children.length, isHard: true });
    const dictionaryTabDeletedStart = templates
      .dictionaryTabStart({ wordCount: wordsDeletedFragment.children.length, isDeleted: true });

    wordsUserFragment.prepend(dictionaryTabUserStart);
    wordsHardFragment.prepend(dictionaryTabHardStart);
    wordsDeletedFragment.prepend(dictionaryTabDeletedStart);

    this.wordsUserContainer.innerHTML = '';
    this.wordsUserContainer.appendChild(wordsUserFragment);

    this.wordsHardContainer.innerHTML = '';
    this.wordsHardContainer.appendChild(wordsHardFragment);

    this.wordsDeletedContainer.innerHTML = '';
    this.wordsDeletedContainer.appendChild(wordsDeletedFragment);
  }

  switchTabs() {
    const { hash } = window.location;

    if (hash === '#words-hard') {
      $('#words-hard-tab').tab('show');
      this.wordsUserButton.classList.add('active');
    } else if (hash === '#words-deleted') {
      $('#words-deleted-tab').tab('show');
      this.wordsHardButton.classList.add('active');
    } else {
      $('#words-user-tab').tab('show');
      this.wordsDeletedButton.classList.add('active');
    }
  }

  async initiate() {
    this.switchTabs();

    window.addEventListener('hashchange', () => {
      if (this.reloadOnHashChange) {
        window.location.reload();
      }
    }, false);

    this.dictionaryNav.addEventListener('click', (event) => {
      const button = event.target.closest('a');

      if (!button) {
        return;
      }

      const newHash = button.getAttribute('aria-controls').replace('-tab', '');
      this.reloadOnHashChange = false;
      window.location.hash = newHash;
      setTimeout(() => {
        this.reloadOnHashChange = true;
      }, 250);
    });

    try {
      this.settings = (await Repository.getSettings()).optional;
    } catch (e) {
      MessageModal.showModal(`Error getting user's settings. Message: ${e.message || 'no message provided'}. Try again later.`);
      return;
    }

    try {
      await this.getWords();
    } catch (e) {
      MessageModal.showModal(`Cannot get words. Message: ${e.message || 'no message provided'}. Try again later.`);
      return;
    }

    this.populateWords();

    this.dictionaryContainer.addEventListener('click', async (event) => {
      const wordElement = event.target.closest('.dictionary__word');
      const audioIcon = event.target.closest('.dictionary__word-audio');
      const restoreIcon = event.target.closest('.dictionary__word-restore');

      if (!wordElement) {
        return;
      }

      const wordId = wordElement.dataset.id;

      if (audioIcon) {
        new Audio(this.wordsObject[wordId].audio).play();
      }

      if (restoreIcon) {
        if (wordElement.classList.contains('dictionary__word_hard')) {
          try {
            await Repository.unmarkWordAsHard(wordId);
          } catch (e) {
            MessageModal.showModal(`Cannot unmark word as hard. Error message: ${e.message || 'no message provided'}. Try again later.`);
          }
        } else if (wordElement.classList.contains('dictionary__word_deleted')) {
          try {
            await Repository.unmarkWordAsDeleted(wordId);
          } catch (e) {
            MessageModal.showModal(`Cannot restore word. Error message: ${e.message || 'no message provided'}. Try again later.`);
          }
        }
        window.location.reload();
      }
    });
  }
}

export default App;
