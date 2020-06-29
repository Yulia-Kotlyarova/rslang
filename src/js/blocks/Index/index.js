import 'bootstrap/js/dist/collapse';
import '../../../sass/styles.scss';

import '@fortawesome/fontawesome-free/js/all.min';
import Header from '../../modules/Header';
import Card from './modules/Card';
import SettingsModal from './modules/SettingsModal';

import 'bootstrap/js/dist/modal';

window.onload = async () => {
  const header = new Header();
  header.run();

  const settingsModal = new SettingsModal();
  await settingsModal.initiate();

  const card = new Card();
  card.getWord();
  card.showCard();
  card.setEventListener();
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
    this.repeatWordButton = document.querySelector('.repeat-word');

    this.todayProgress = document.querySelector('.progress');
    this.todayStudiedWordsOutput = document.querySelector('.today-studied-words');
    this.availabelWordsToStudy = document.querySelector('.max-available-words');
    this.wordSettings = document.querySelector('.word-difficulty-level');
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

    this.isTranscription = true;
    this.isWordImage = true;
  }

  wordsHandler() {
    if (this.wordPositionInResponse >= this.actualWordsData.length) {
      this.getWord();
      this.wordPositionInResponse = 0;
    } else {
      this.wordData = this.actualWordsData[this.wordPositionInResponse];
      console.log(this.actualWordsData);
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
    console.log(this.actualWordsData);
    console.log(this.word);
    console.log(this.wordData);
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

    this.cardWrapper.prepend(this.card);
  }

  showWordInput(wordData) {
    this.word = wordData.word;
    const wordField = document.createElement('span');
    wordField.classList.add('word-wrapper');

    this.card.append(wordField);
    const wordLength = wordData.word.length;
    for (let i = 0; i < wordLength; i += 1) {
      const letterContainer = document.createElement('span');
      letterContainer.innerText = this.word[i];
      letterContainer.classList.add('hidden');
      letterContainer.setAttribute('index', i);
      wordField.append(letterContainer);
    }
    const wordInput = document.createElement('input');
    wordInput.classList.add('word-field');
    wordInput.setAttribute('spellcheck', false);
    wordField.append(wordInput);
    wordInput.addEventListener('input', () => {
      const hiddenRightWord = [...document.querySelectorAll('.word-wrapper span[index]')];
      hiddenRightWord.forEach((item) => {
        const currentItem = item;
        currentItem.className = 'hidden';
      });
    });

    if (this.isTranscription) {
      const transcription = document.createElement('p');
      transcription.innerText = this.wordData.transcription;
      this.card.append(transcription);
    }

    if (this.isTranslate) {
      const wordTranslate = document.createElement('p');
      wordTranslate.innerText = wordData.wordTranslate;
      this.card.append(wordTranslate);
    }

    if (this.isWordImage) {
      const wordImage = document.createElement('img');
      wordImage.src = this.wordData.image;
      this.card.append(wordImage);
    }

    if (this.isWordMeaning) {
      this.showWordInfo(wordData.textMeaning);
    }
    if (this.isTextExample) {
      this.showWordInfo(wordData.textExample);
    }
    wordInput.focus();
    this.isChecked = false;
  }

  showWordInfo(wordInfo) {
    const sentenceDelimiter = new RegExp(this.word, 'i');
    const dataWithoutWord = wordInfo.split(sentenceDelimiter);
    const container = document.createElement('p');
    if (wordInfo === this.wordData.textMeaning) {
      container.classList.add('word-meaning');
    } else {
      container.classList.add('word-text-example');
    }
    this.card.append(container);
    const hiddenWord = `<span class="hidden-word word-wrapper">${this.word}</span>`;
    container.innerHTML = dataWithoutWord.join(hiddenWord);
  }

  showTranslate() {
    if (this.isWordMeaning) {
      const wordMeaning = document.querySelector('.word-meaning');
      const wordMeaningTranslate = document.createElement('p');
      wordMeaningTranslate.innerText = this.wordData.textMeaningTranslate;
      wordMeaning.after(wordMeaningTranslate);
    }
    if (this.isTextExample) {
      const wordTextExample = document.querySelector('.word-text-example');
      const wordTextExampleTranslate = document.createElement('p');
      wordTextExampleTranslate.innerText = this.wordData.textExampleTranslate;
      wordTextExample.after(wordTextExampleTranslate);
    }
  }

  playWordAudio(audiofileIndex) {
    const wordAudioData = [...document.querySelectorAll('.word-audio')];
    if (audiofileIndex >= wordAudioData.length) return;
    wordAudioData[audiofileIndex].addEventListener('ended', () => {
      const nextAudiofileIndex = audiofileIndex + 1;
      this.playWordAudio(nextAudiofileIndex);
    }, { once: true });
    wordAudioData[audiofileIndex].play();
  }

  showAudio() {
    const wordField = document.querySelector('.word-wrapper');
    const wordAudio = document.createElement('audio');
    wordAudio.src = this.wordData.audio;
    wordAudio.classList.add('word-audio');
    wordAudio.setAttribute('controls', 'controls');
    wordField.after(wordAudio);
    if (this.isWordMeaning) {
      const wordMeaning = document.querySelector('.word-meaning');
      const wordMeaningAudio = document.createElement('audio');
      wordMeaningAudio.classList.add('word-audio');
      wordMeaningAudio.setAttribute('controls', 'controls');
      wordMeaningAudio.src = this.wordData.audioMeaning;
      wordMeaning.after(wordMeaningAudio);
    }
    if (this.isTextExample) {
      const wordTextExample = document.querySelector('.word-text-example');
      const wordTextExampleAudio = document.createElement('audio');
      wordTextExampleAudio.classList.add('word-audio');
      wordTextExampleAudio.setAttribute('controls', 'controls');
      wordTextExampleAudio.src = this.wordData.audioExample;
      wordTextExample.after(wordTextExampleAudio);
    }
    if (this.isAutoplayAudio) {
      const startIndexAudio = 0;
      this.playWordAudio(startIndexAudio);
    }
  }

  showRightAnswer() {
    if (this.isChecked) return;
    this.isChecked = true;
    const entryField = document.querySelector('.word-field');
    this.nextCardButton.classList.remove('hidden');
    this.wordSettings.classList.remove('hidden');
    entryField.classList.add('right-letter');
    if (this.isWordMeaning || this.isTextExample) {
      const hiddenWords = document.querySelectorAll('.hidden-word');
      hiddenWords.forEach((item) => {
        item.classList.remove('hidden-word');
      });
    }
    entryField.value = this.word;
    if (this.isTranslate) {
      this.showTranslate();
    }
    this.showAudio();
    this.todayStudiedWords = Number(this.todayStudiedWords) + 1;
    localStorage.setItem('todayStudiedWords', this.todayStudiedWords);
  }

  checkWord() {
    const entryField = document.querySelector('.word-field');
    const hiddenRightWord = [...document.querySelectorAll('.word-wrapper span[index]')];
    const wordValue = entryField.value;
    if (this.word !== entryField.value) {
      this.repeatHardWord();
      for (let i = 0; i < hiddenRightWord.length; i += 1) {
        if (wordValue[i] === hiddenRightWord[i].textContent) {
          hiddenRightWord[i].classList.add('right-letter');
        } else {
          hiddenRightWord[i].classList.add('wrong-letter');
        }
      }
      entryField.value = '';
      hiddenRightWord.forEach((item) => {
        item.classList.remove('hidden');
      });
      setTimeout(() => {
        hiddenRightWord.forEach((item) => {
          item.classList.add('opacity');
        });
        entryField.focus();
      }, 1000);
    } else {
      this.showRightAnswer();
    }
  }

  clearCard() {
    while (this.card.firstChild) {
      this.card.removeChild(this.card.firstChild);
    }
  }

  nextCard() {
    this.isMistake = false;
    this.nextCardButton.classList.add('hidden');
    this.wordSettings.classList.add('hidden');
    this.todayProgress.setAttribute('value', this.todayStudiedWords);
    this.todayStudiedWordsOutput.innerText = this.todayStudiedWords;
    this.clearCard();
    this.wordsHandler();
  }

  setEventListener() {
    this.showAnswerButton.addEventListener('click', this.showRightAnswer.bind(this));
    this.checkWordButton.addEventListener('click', this.checkWord.bind(this));
    this.nextCardButton.addEventListener('click', this.nextCard.bind(this));
    this.repeatWordButton.addEventListener('click', this.repeatHardWord.bind(this));
    document.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        this.checkWord();
      }
    });
  }
}

const card = new Card();
card.showCard();
card.getWord();
card.setEventListener();
