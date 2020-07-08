import Repository from '../../../modules/Repository';

class Card {
  constructor() {
    this.actualWordsData = null;
    this.card = null;
    this.word = null;
    this.wordData = null;
    this.nextStudyInterval = 12 * 60 * 60 * 1000;
    this.oneHourInMiliseconds = 60 * 60 * 1000;
    this.oneMinuteInMiliseconds = 60 * 1000;
    this.oneSecondInMiliseconds = 1000;
    this.studyFinishAt = localStorage.getItem('studyFinishAt') ? localStorage.getItem('studyFinishAt') : 0;
    this.defaultWordInterval = 5;

    this.token = localStorage.getItem('token');
    this.userId = localStorage.getItem('userId');

    this.cardWrapper = document.querySelector('.card-wrapper');
    this.warningWindow = document.querySelector('.warning-window');

    this.showAnswerButton = document.querySelector('.show-answer');
    this.checkWordButton = document.querySelector('.check');
    this.difficultWordButton = document.querySelector('.difficult-word');
    this.removeWordButton = document.querySelector('.delete-word');
    this.nextCardButton = document.querySelector('.next-card-btn');
    this.repeatWordButton = document.querySelector('.again');

    this.todayProgress = document.querySelector('.progress');
    this.todayStudiedWordsOutput = document.querySelector('.today-studied-words');
    this.availabelWordsToStudy = document.querySelector('.max-available-words');
    this.timeoutStudy = document.querySelector('.timeout');
    this.wordSettings = document.querySelector('.word-settings');
    this.wordDifficultyLevel = document.querySelector('.word-difficulty-level');

    this.wordPositionInResponse = 0;
    this.todayStudiedNewWords = localStorage.getItem('todayStudiedNewWords') ? localStorage.getItem('todayStudiedNewWords') : 0;
    this.todayStudiedWords = localStorage.getItem('todayStudiedWords') ? localStorage.getItem('todayStudiedWords') : 0;

    this.settings = JSON.parse(localStorage.getItem('settings'));
    this.numberOfNewWordsToStudy = this.settings.wordsPerDay;
    this.numberOfCardsByDay = this.settings.maxCardsPerDay;
    this.wordsToStudy = this.settings.wordsToStudy;
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

    this.card = document.querySelector('.word-card');
    this.wordInput = this.card.querySelector('.word-field-spellcheck');
    this.wordField = this.card.querySelector('.word-field-top');
    this.transcription = this.card.querySelector('.transcription');
    this.wordTranslate = this.card.querySelector('.word-translate');
    this.wordImage = this.card.querySelector('.word-image');
    this.wordMeaning = this.card.querySelector('.word-meaning');
    this.wordMeaningTranslate = this.card.querySelector('.word-meaning-translate');
    this.wordTextExample = this.card.querySelector('.word-text-example');
    this.wordTextExampleTranslate = this.card.querySelector('.word-text-example-translate');

    this.wordMeaningAudio = this.card.querySelector('.word-meaning-audio');
    this.wordAudio = this.card.querySelector('.word-audio');
    this.wordTextExampleAudio = this.card.querySelector('.word-text-example-audio');
  }

  wordsHandler() {
    this.checkStudyProgress();
    if (this.wordPositionInResponse >= this.actualWordsData.length) {
      this.getWord();
      this.wordPositionInResponse = 0;
    } else {
      this.wordData = this.actualWordsData[this.wordPositionInResponse];
      this.showWordInput(this.wordData);
      this.wordPositionInResponse += 1;
    }
  }

  checkStudyProgress() {
    if (Number(this.todayStudiedWords) > Number(this.numberOfCardsByDay)
          || Number(this.todayStudiedNewWords) > Number(this.numberOfNewWordsToStudy)
          || (this.actualWordsData.length - 1) === this.wordPositionInResponse) {
      this.showWarningWindow();
      if (!this.studyFinishAt) {
        this.studyFinishAt = Date.now();
        localStorage.setItem('studyFinishAt', this.studyFinishAt);
      }
      this.runTimer();
    } else {
      this.hideWarningWindow();
    }
  }

  runTimer() {
    setInterval(this.nextStudyTimer.bind(this), 1000);
  }

  nextStudyTimer() {
    const nextStudyTime = Number(this.studyFinishAt) + Number(this.nextStudyInterval);
    const timeNow = Date.now();
    if (timeNow > nextStudyTime) {
      this.hideWarningWindow();
    }
    if (Number(this.studyFinishAt) > 0 && (timeNow > nextStudyTime)) {
      this.todayStudiedNewWords = 0;
      this.todayStudiedWords = 0;
    }
    let hours = Math.trunc((nextStudyTime - timeNow) / this.oneHourInMiliseconds);
    let minutes = Math.trunc((nextStudyTime - timeNow - hours
      * this.oneHourInMiliseconds)
      / this.oneMinuteInMiliseconds);
    let secondes = Math.trunc((nextStudyTime - timeNow - hours
      * this.oneHourInMiliseconds - minutes * this.oneMinuteInMiliseconds)
      / this.oneSecondInMiliseconds);
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (secondes < 10) {
      secondes = `0${secondes}`;
    }
    this.timeoutStudy.innerText = `${hours}:${minutes}:${secondes}`;
  }

  async getWord() {
    switch (true) {
      case this.wordsToStudy === 'new':
        { const data = await Repository.getNewWords(undefined, this.numberOfCardsByDay);
          this.actualWordsData = data;
          this.wordsHandler(); }
        break;
      case this.wordsToStudy === 'mixed':
        { const data = await Repository.getMixedWordsWithMandatoryNew(this.numberOfNewWordsToStudy,
          undefined, this.numberOfCardsByDay);
        this.actualWordsData = data;
        this.wordsHandler(); }
        break;
      case this.wordsToStudy === 'repeat':
        { const data = await Repository.getAllUserWords(undefined, this.numberOfCardsByDay);
          this.actualWordsData = data;
          this.wordsHandler(); }
        break;
      default:
      { const data = await Repository.getMixedWords(undefined, this.numberOfCardsByDay);
        this.actualWordsData = data;
        this.wordsHandler(); }
    }
  }

  async repeatWrongWord() {
    if (this.isMistake) {
      return;
    }
    this.isMistake = true;
    const difficultyLevel = '0';
    const wordId = this.wordData._id; // eslint-disable-line no-underscore-dangle
    await this.setWordDifficulty(wordId, difficultyLevel);
    const updatedWord = await Repository.getOneUserWord(wordId);
    const nextRepeatUpdatedWord = updatedWord.userWord.optional.playNextDate;

    const newPosition = this.actualWordsData.findIndex((item) => item.hasOwnProperty('userWord') && item.userWord.optional.playNextDate > nextRepeatUpdatedWord); // eslint-disable-line no-prototype-builtins
    if ((newPosition !== -1)
        && ((newPosition - this.wordPositionInResponse) > this.defaultWordInterval)) {
      this.actualWordsData.splice(newPosition, 0, updatedWord);
    } else {
      this.actualWordsData.splice(this.wordPositionInResponse
        + this.defaultWordInterval, 0, updatedWord);
    }
  }

  async removeWord() {
    const wordId = this.wordData._id; // eslint-disable-line no-underscore-dangle
    await Repository.markWordAsDeleted(wordId);
  }

  showWarningWindow() {
    this.warningWindow.classList.remove('hide-window');
  }

  hideWarningWindow() {
    this.warningWindow.classList.add('hide-window');
  }

  showCard() {
    this.todayProgress.setAttribute('max', this.numberOfCardsByDay);
    this.todayProgress.setAttribute('value', this.todayStudiedWords);
    this.todayStudiedWordsOutput.innerText = this.todayStudiedWords;
    this.availabelWordsToStudy.innerText = this.numberOfCardsByDay;
    if (this.isShowAnswer) {
      this.showAnswerButton.classList.remove('hidden');
    } else {
      this.showAnswerButton.classList.add('hidden');
    }

    if (this.isDifficultButtonVisible) {
      this.difficultWordButton.classList.remove('hidden');
    } else {
      this.difficultWordButton.classList.add('hidden');
    }

    if (this.isRemoveButtonVisible) {
      this.removeWordButton.classList.remove('hidden');
    } else {
      this.removeWordButton.classList.add('hidden');
    }
  }

  showWordInput(wordData) {
    this.word = wordData.word;
    const wordLength = wordData.word.length;

    for (let i = 0; i < wordLength; i += 1) {
      this.wordField.innerHTML += `<span class="index-hidden" index="${i}">${this.word[i]}</span>`;
    }

    if (this.isTranscription) {
      this.transcription.innerText = this.wordData.transcription;
    }

    if (this.isTranslate) {
      this.wordTranslate.innerText = wordData.wordTranslate;
    }

    if (this.isWordImage) {
      this.wordImage.src = this.wordData.image;
    }

    if (this.isWordMeaning) {
      this.showWordInfo(wordData.textMeaning);
    }
    if (this.isTextExample) {
      this.showWordInfo(wordData.textExample);
    }

    this.wordInput.focus();
    this.isChecked = false;
  }

  showWordInfo(wordInfo) {
    const sentenceDelimiter = new RegExp(this.word, 'i');
    const dataWithoutWord = wordInfo.split(sentenceDelimiter);

    const hiddenWord = `<span class="hidden-word word-wrapper">${this.word}</span>`;

    if (wordInfo === this.wordData.textMeaning) {
      this.wordMeaning.innerHTML = dataWithoutWord.join(hiddenWord);
    } else {
      this.wordTextExample.innerHTML = dataWithoutWord.join(hiddenWord);
    }
  }

  showTranslate() {
    if (this.isWordMeaning) {
      this.wordMeaningTranslate.innerText = this.wordData.textMeaningTranslate;
      this.wordMeaningTranslate.classList.remove('d-none');
    }
    if (this.isTextExample) {
      this.wordTextExampleTranslate.innerText = this.wordData.textExampleTranslate;
      this.wordTextExampleTranslate.classList.remove('d-none');
    }
  }

  playWordAudio(audiofileIndex) {
    const wordAudioData = [...document.querySelectorAll('.word-audio')];
    if (audiofileIndex >= wordAudioData.length) {
      return;
    }
    wordAudioData[audiofileIndex].addEventListener('ended', () => {
      const nextAudiofileIndex = audiofileIndex + 1;
      this.playWordAudio(nextAudiofileIndex);
    }, { once: true });
    wordAudioData[audiofileIndex].play();
  }

  showAudio() {
    this.wordAudio.src = this.wordData.audio;
    this.wordAudio.classList.remove('d-none');

    if (this.isWordMeaning) {
      this.wordMeaningAudio.src = this.wordData.audioMeaning;
      this.wordMeaningAudio.classList.remove('d-none');
    }

    if (this.isTextExample) {
      this.wordTextExampleAudio.src = this.wordData.audioExample;
      this.wordTextExampleAudio.classList.remove('d-none');
    }

    if (this.isAutoplayAudio) {
      const startIndexAudio = 0;
      this.playWordAudio(startIndexAudio);
    }
  }

  showRightAnswer() {
    if (this.isChecked) {
      return;
    }
    this.isChecked = true;
    this.wordInput.value = this.word;
    this.wordInput.classList.add('right-letter');
    if (this.isWordMeaning || this.isTextExample) {
      const hiddenWords = document.querySelectorAll('.hidden-word');
      hiddenWords.forEach((item) => {
        item.classList.remove('hidden-word');
      });
      this.todayStudiedWords = Number(this.todayStudiedWords) + 1;
      localStorage.setItem('todayStudiedWords', this.todayStudiedWords);
      if (!this.wordData.hasOwnProperty('userWord')) { // eslint-disable-line no-prototype-builtins
        this.todayStudiedNewWords = Number(this.todayStudiedNewWords) + 1;
        localStorage.setItem('todayStudiedNewWords', this.todayStudiedNewWords);
      }
      if (!this.isAutoplayAudio && !this.isDifficultButtonVisible) {
        setTimeout(() => { this.nextCard(); }, 2000);
        return;
      }
      this.nextCardButton.classList.remove('hidden');
      this.wordSettings.classList.remove('hidden');
      this.wordInput.classList.add('right-letter');
    }
    if (this.isTranslate) {
      this.showTranslate();
    }
    this.showAudio();
  }

  checkWord() {
    const entryField = document.querySelector('.word-field');
    const hiddenRightWord = [...document.querySelectorAll('.word-wrapper span[index]')];
    if (this.word !== entryField.value) {
      for (let i = 0; i < hiddenRightWord.length; i += 1) {
        if (this.word[i] === entryField.value[i]) {
          hiddenRightWord[i].classList.add('right-letter');
        } else { hiddenRightWord[i].classList.add('wrong-letter'); }
      }
      entryField.value = '';
      hiddenRightWord.forEach((item) => {
        item.classList.remove('index-hidden');
      });
      setTimeout(() => {
        hiddenRightWord.forEach((item) => {
          item.classList.add('opacity');
        });
        entryField.focus();
      }, 1000);
    } else {
      this.showRightAnswer();
      const wordId = this.wordData._id; // eslint-disable-line no-underscore-dangle
      const difficultyLevel = '3';
      this.setWordDifficulty(wordId, difficultyLevel);
    }
  }

  clearCard() {
    this.wordInput.innerHTML = '';
    this.wordField.innerHTML = '';
    this.wordInput.value = '';
    this.wordInput.classList.remove('right-letter');
    this.wordAudio.classList.add('d-none');
    this.wordMeaningAudio.classList.add('d-none');
    this.wordTextExampleAudio.classList.add('d-none');
    this.wordMeaningTranslate.classList.add('d-none');
    this.wordTextExampleTranslate.classList.add('d-none');
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

  async setWordDifficulty(wordId, difficultyLevel) { // eslint-disable-line class-methods-use-this
    await Repository.saveWordResult({ wordId, result: difficultyLevel });
  }

  getWordDifficulty(event) {
    if (!event.target.classList.contains('difficulty-level')) {
      return;
    }
    const difficultyLevel = event.target.value;
    const wordId = this.wordData._id; // eslint-disable-line no-underscore-dangle
    this.setWordDifficulty(wordId, difficultyLevel);
  }

  async markDifficultWord() {
    const wordId = this.wordData._id; // eslint-disable-line no-underscore-dangle
    await Repository.markWordAsDeleted(wordId);
  }

  setEventListener() {
    this.showAnswerButton.addEventListener('click', this.showRightAnswer.bind(this));
    this.checkWordButton.addEventListener('click', this.checkWord.bind(this));
    this.nextCardButton.addEventListener('click', this.nextCard.bind(this));
    this.repeatWordButton.addEventListener('click', this.repeatWrongWord.bind(this));
    this.wordDifficultyLevel.addEventListener('click', this.getWordDifficulty.bind(this));
    this.removeWordButton.addEventListener('click', this.removeWord.bind(this));
    this.difficultWordButton.addEventListener('click', this.markDifficultWord.bind(this));

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        this.checkWord();
      }
    });

    this.wordInput.addEventListener('input', () => {
      const hiddenRightWord = [...this.wordField.children];
      hiddenRightWord.forEach((item) => {
        const currentItem = item;
        currentItem.className = 'index-hidden';
      });
    });
  }
}

export default Card;
