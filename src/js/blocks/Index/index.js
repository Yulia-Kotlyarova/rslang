import 'bootstrap/js/dist/collapse';
import '../../../sass/styles.scss';

import '@fortawesome/fontawesome-free/js/all.min';
import Header from '../../modules/Header';

import 'bootstrap/js/dist/modal';

window.onload = () => {
  const header = new Header();
  header.run();
};

class Card {
  constructor() {
    this.actualWordsData = null;
    this.card = null;
    this.word = null;
    this.wordData = null;

    this.token = localStorage.getItem('token');
    this.userId = localStorage.getItem('userId');

    this.cardWrapper = document.querySelector('.card-wrapper');

    this.showAnswerButton = document.querySelector('.show-answer');
    this.checkWordButton = document.querySelector('.check');
    this.difficultWordButton = document.querySelector('.difficult-word');
    this.removeWordButton = document.querySelector('.delete-word');
    this.nextCardButton = document.querySelector('.next-card-btn');
    this.repeatWordButton = document.querySelector('.again');

    this.todayProgress = document.querySelector('.progress');
    this.todayStudiedWordsOutput = document.querySelector('.today-studied-words');
    this.availabelWordsToStudy = document.querySelector('.max-available-words');
    this.wordSettings = document.querySelector('.word-settings');
    this.wordDifficultyLevel = document.querySelector('.word-difficulty-level');

    this.wordPositionInResponse = 0;
    this.todayStudiedWords = (localStorage.getItem('todayStudiedWords')) ? localStorage.getItem('todayStudiedWords') : 0;

    this.settings = JSON.parse(localStorage.getItem('settings'));
    this.numberOfNewWordsToStudy = this.settings.wordsPerDay;
    this.numberOfCardsByDay = this.settings.maxCardsPerDay;
    this.isShowAnswer = this.settings.isShowAnswerButtonVisible;

    this.isTranslate = this.settings.isTranslationVisible;
    this.isWordMeaning = this.settings.isExplanationVisible;
    this.isTextExample = this.settings.isExampleVisible;
    this.isDifficultButtonVisible = this.settings.isDifficultButtonVisible;
    this.isRemoveButtonVisible = this.settings.isRemoveButtonVisible;

    this.isTranscription = this.settings.isTranscriptionVisible;
    this.isWordImage = this.settings.isPictureVisible;
    this.isAutoplayAudio = this.settings.isSoundAutoPlay;

    this.isChecked = false;
    this.isMistake = false;
    this.mistakenWordRepeatInterval = 3;
  }

  wordsHandler() {
    if (this.wordPositionInResponse >= this.actualWordsData.length) {
      this.getWord();
      this.wordPositionInResponse = 0;
    } else {
      this.wordData = this.actualWordsData[this.wordPositionInResponse];
      this.showWordInput(this.wordData);
      this.wordPositionInResponse += 1;
    }
  }

  async getWord() {
    const url = 'https://afternoon-falls-25894.herokuapp.com/words?page=2&group=0';
    const res = await fetch(url);
    const data = await res.json();
    this.actualWordsData = data;
    this.wordsHandler();
  }

  async getUserWords() {
    const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${this.userId}/words`, {
      method: 'GET',
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
      },
    });
    const content = await rawResponse.json();
    console.log(content);
  }

  repeatHardWord() {
    if (this.isMistake) return;
    this.isMistake = true;
    if ((this.actualWordsData.length - this.wordPositionInResponse)
    > this.mistakenWordRepeatInterval) {
      this.actualWordsData.splice(this.wordPositionInResponse + this.mistakenWordRepeatInterval,
        0, this.wordData);
    } else { this.actualWordsData.push(this.wordData); }
  }

  showCard() {
    this.card = document.createElement('div');
    this.card.classList.add('word-card');
    this.todayProgress.setAttribute('max', this.numberOfCardsByDay);
    this.todayProgress.setAttribute('value', this.todayStudiedWords);
    this.todayStudiedWordsOutput.innerText = this.todayStudiedWords;
    this.availabelWordsToStudy.innerText = this.numberOfCardsByDay;
    if (this.isShowAnswer) {
      this.showAnswerButton.classList.remove('hidden');
    } else { this.showAnswerButton.classList.add('hidden'); }

    if (this.isDifficultButtonVisible) {
      this.difficultWordButton.classList.remove('hidden');
    } else { this.difficultWordButton.classList.add('hidden'); }

    if (this.isRemoveButtonVisible) {
      this.removeWordButton.classList.remove('hidden');
    } else { this.removeWordButton.classList.add('hidden'); }
  }
}
const card = new Card();
card.getWord();
card.showCard();
card.setEventListener();
