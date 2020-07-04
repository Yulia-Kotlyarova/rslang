import 'bootstrap/js/dist/collapse';
import '../../../sass/styles.scss';

import '@fortawesome/fontawesome-free/js/all.min';
import Header from '../../modules/Header';

import 'bootstrap/js/dist/index';
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/button';
import 'bootstrap/js/dist/modal';

window.onload = () => {
  const header = new Header();
  header.run();
};

class Card {
  constructor() {
    this.word = null;
    this.wordData = null;
    this.cardWrapper = document.querySelector('.card-wrapper');
    this.todayProgress = document.querySelector('.progress');
    this.todayStudiedWordsOutput = document.querySelector('.today-studied-words');
    this.availabelWordsToStudy = document.querySelector('.max-available-words');
    this.card = null;
    this.actualWordsData = null;
    this.wordPositionInResponse = 0;
    this.todayStudiedWords = (localStorage.getItem('todayStudiedWords')) ? localStorage.getItem('todayStudiedWords') : 0;
    this.numberOfWordsToStudy = 50;

    this.isChecked = false;
    this.isShowAnswer = true;

    this.isTranslate = true;
    this.isWordMeaning = true;
    this.isTextExample = true;

    this.isTranscription = true;
    this.isWordImage = true;
    this.isAutoplayAudio = true;
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

  showCard() {
    this.card = document.createElement('div');
    const showAnswerButton = document.createElement('button');
    const checkWordButton = document.createElement('button');
    const nextCardButton = document.createElement('button');
    this.card.classList.add('word-card');
    this.todayProgress.setAttribute('max', this.numberOfWordsToStudy);
    this.todayProgress.setAttribute('value', this.todayStudiedWords);
    this.todayStudiedWordsOutput.innerText = this.todayStudiedWords;
    this.availabelWordsToStudy.innerText = this.numberOfWordsToStudy;
    showAnswerButton.classList.add('show-answer');
    showAnswerButton.innerText = 'Show answer';
    if (!this.isShowAnswer) {
      showAnswerButton.classList.add('hidden');
    }
    checkWordButton.classList.add('check');
    checkWordButton.innerText = 'Check';
    nextCardButton.classList.add('next-card-btn', 'hidden');
    nextCardButton.innerText = 'Next';
    this.cardWrapper.prepend(this.card, showAnswerButton, checkWordButton, nextCardButton);
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
    const nextCardButton = document.querySelector('.next-card-btn');
    nextCardButton.classList.remove('hidden');
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
    const nextCardButton = document.querySelector('.next-card-btn');
    nextCardButton.classList.add('hidden');
    this.todayProgress.setAttribute('value', this.todayStudiedWords);
    this.todayStudiedWordsOutput.innerText = this.todayStudiedWords;
    this.clearCard();
    this.wordsHandler();
  }

  setEventListener() {
    const showAnswerButton = document.querySelector('.show-answer');
    const checkWordButton = document.querySelector('.check');
    const nextCardButton = document.querySelector('.next-card-btn');
    showAnswerButton.addEventListener('click', this.showRightAnswer.bind(this));
    checkWordButton.addEventListener('click', this.checkWord.bind(this));
    nextCardButton.addEventListener('click', this.nextCard.bind(this));
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
