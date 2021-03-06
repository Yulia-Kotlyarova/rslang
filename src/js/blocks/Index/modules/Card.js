import Repository from '../../../modules/Repository';
import MessageModal from '../../../modules/MessageModal';
import ShortStatistics from '../../Statistics/ShortStatistics';
import { coefficients, intervals } from '../../../constants/intervalRepetition';
import getTodayShort from '../../../helpers';

class Card {
  constructor() {
    this.actualWordsData = null;
    this.card = null;
    this.word = null;
    this.wordData = null;
    this.audio = null;

    this.oneDayInMiliseconds = 24 * 60 * 60 * 1000;
    this.defaultWordInterval = 5;
    this.wordLevel = '2';

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
    this.markedHardWord = document.querySelector('.marked-hard-word');
    this.unmarkedHardWord = document.querySelector('.unmarked-hard-word');

    this.wordPositionInResponse = 0;

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
    this.isMarkedWordLevel = false;
    this.isMarkedHardWord = false;

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

    this.updateTodayWords();
  }

  updateTodayWords() {
    const statisticsJSON = localStorage.getItem('statistics');
    const statistics = JSON.parse(statisticsJSON);

    const todayShort = getTodayShort();

    if (
      !statistics.optional
      || !statistics.optional.dates
      || !statistics.optional.dates[todayShort]
    ) {
      this.todayStudiedNewWords = 0;
      this.todayStudiedWords = 0;
    } else {
      this.todayStudiedNewWords = statistics.optional.dates[todayShort].learnedToday || 0;
      this.todayStudiedWords = statistics.optional.dates[todayShort].answersGivenToday || 0;
    }
  }

  wordsHandler() {
    this.checkStudyProgress();
    if (this.wordPositionInResponse >= this.actualWordsData.length - 1) {
      this.getWord();
      this.wordPositionInResponse = 0;
    } else {
      this.wordData = this.actualWordsData[this.wordPositionInResponse];
      this.showWordInput(this.wordData);
      this.wordPositionInResponse += 1;
    }
  }

  async checkStudyProgress() {
    if (Number(this.todayStudiedWords) >= Number(this.numberOfCardsByDay)
          || Number(this.todayStudiedNewWords) >= Number(this.numberOfNewWordsToStudy)) {
      this.showWarningWindow();

      try {
        const shortStatistics = new ShortStatistics();
        await shortStatistics.showModal();
      } catch (error) {
        return;
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
    const timeNow = Date.now();
    if (this.todayStudiedWords === 0) {
      this.hideWarningWindow();
    }
    const tommorow = new Date(timeNow + this.oneDayInMiliseconds);
    this.timeoutStudy.innerText = `${tommorow.toLocaleDateString()}`;
  }

  async getWord() {
    try {
      switch (true) {
        case window.location.hash === '#hardWords':
          { const data = await Repository.getHardWords(undefined, 3600);
            this.actualWordsData = data;
            this.wordsHandler(); }
          break;
        case this.wordsToStudy === 'new':
          { const data = await Repository.getNewWords(undefined, this.numberOfCardsByDay);
            this.actualWordsData = data;
            this.wordsHandler(); }
          break;
        case this.wordsToStudy === 'mixed':
          { const data = await Repository.getMixedWordsWithMandatoryNew(
            this.numberOfNewWordsToStudy, undefined, this.numberOfCardsByDay,
          );
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
    } catch (error) {
      const modalError = document.querySelector('.fetchWordsCollectionError');
      if (!modalError) {
        const messageModal = new MessageModal();
        messageModal.appendSelf('fetchWordsCollectionError');
      }
      MessageModal.showModal('Sorry, something went wrong. Try again, please.', undefined, 'fetchWordsCollectionError');
    }
  }

  getPlayNextDate(result) { // eslint-disable-line consistent-return
    let interval;

    if (!this.wordData.userWord) {
      this.wordData.userWord = {};
    }
    if (!this.wordData.userWord.optional) {
      this.wordData.userWord.optional = {};
    }

    if (result === '0') {
      interval = intervals.defaultAgainInterval;
      this.wordData.userWord.optional.lastPlayedDate = Date.now();
      this.wordData.userWord.optional.playNextDate = Date.now() + interval;
    } else {
      const { lastPlayedDate } = this.wordData.userWord.optional;

      if (lastPlayedDate) {
        interval = Date.now() - lastPlayedDate;
      } else {
        interval = intervals.defaultInterval;
      }

      if (interval < intervals.defaultInterval) {
        interval = intervals.defaultInterval;
      }

      this.wordData.userWord.optional.lastPlayedDate = Date.now();
      this.wordData.userWord.optional.playNextDate = Date.now() + (interval * coefficients[result]);

      return this.wordData.userWord.optional.playNextDate;
    }
  }

  async repeatWord() {
    await this.repeatWrongWord();
    this.nextCard();
  }

  async repeatWrongWord() {
    if (this.isMistake) {
      return;
    }
    try {
      this.isMistake = true;
      const difficultyLevel = '0';
      const wordId = this.wordData._id; // eslint-disable-line no-underscore-dangle
      await this.setWordDifficulty(wordId, difficultyLevel);
      const nextRepeatUpdatedWord = this.getPlayNextDate(difficultyLevel);
      const newPosition = this.actualWordsData.findIndex((item) => item.userWord
          && item.userWord.optional
          && item.userWord.optional.playNextDate
          && item.userWord.optional.playNextDate > nextRepeatUpdatedWord);
      if ((newPosition !== -1)
          && ((newPosition - this.wordPositionInResponse) > this.defaultWordInterval)) {
        this.actualWordsData.splice(newPosition, 0, this.wordData);
      } else {
        this.actualWordsData.splice(this.wordPositionInResponse
          + this.defaultWordInterval, 0, this.wordData);
      }
    } catch (error) {
      const modalError = document.querySelector('.fetchWordsCollectionError');
      if (!modalError) {
        const messageModal = new MessageModal();
        messageModal.appendSelf('fetchWordsCollectionError');
      }
      MessageModal.showModal('Sorry, something went wrong. Try again, please.', undefined, 'fetchWordsCollectionError');
    }
  }

  async removeWord() {
    try {
      const wordId = this.wordData._id; // eslint-disable-line no-underscore-dangle
      await Repository.markWordAsDeleted(wordId);
      this.isMistake = true;
      this.nextCard();
      this.isMistake = true;
    } catch (error) {
      const modalError = document.querySelector('.fetchWordsCollectionError');
      if (!modalError) {
        const messageModal = new MessageModal();
        messageModal.appendSelf('fetchWordsCollectionError');
      }
      MessageModal.showModal('Sorry, something went wrong. Try again, please.', undefined, 'fetchWordsCollectionError');
    }
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
    const overlay = document.querySelector('.overlay-window');
    overlay.classList.add('hide-window');
    this.word = wordData.word;
    const wordLength = wordData.word.length;
    this.wordInput.setAttribute('maxlength', wordLength);

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
    if (this.wordData.hasOwnProperty('userWord.optional.isHard') // eslint-disable-line no-prototype-builtins
      && this.wordData.userWord.optional.isHard) {
      this.isMarkedHardWord = true;
      this.showHardButton();
    } else {
      this.isMarkedHardWord = false;
      this.showHardButton();
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
    this.audio = wordAudioData[audiofileIndex];
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
    }

    if (!this.isAutoplayAudio && !this.isDifficultButtonVisible) {
      setTimeout(() => { this.nextCard(); }, 2000);
      return;
    }

    if (!this.isDifficultButtonVisible || this.isMistake) {
      this.nextCardButton.classList.remove('hidden');
    }

    if (this.isDifficultButtonVisible && !this.isMistake) {
      this.wordSettings.classList.remove('hidden');
    }

    if (this.isTranslate) {
      this.showTranslate();
    }
    this.showAudio();
  }

  async checkWord() {
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
      await this.repeatWrongWord();
    } else {
      this.showRightAnswer();
      if (!this.isMistake) {
        this.wordLevel = '3';
      }
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

  async nextCard() {
    if (this.audio) {
      this.audio.pause();
    }

    if (!this.isMistake) {
      const wordId = this.wordData._id; // eslint-disable-line no-underscore-dangle
      const difficultyLevel = this.wordLevel;
      await this.setWordDifficulty(wordId, difficultyLevel);
    }

    this.isMarkedWordLevel = false;
    this.wordLevel = '2';
    this.isMistake = false;
    this.nextCardButton.classList.add('hidden');
    this.wordSettings.classList.add('hidden');
    this.todayProgress.setAttribute('value', this.todayStudiedWords);
    this.todayStudiedWordsOutput.innerText = this.todayStudiedWords;
    this.clearCard();
    this.wordsHandler();
  }

  async setWordDifficulty(wordId, difficultyLevel) { // eslint-disable-line class-methods-use-this
    try {
      await Repository.saveWordResult({ wordId, result: difficultyLevel });
      this.updateTodayWords();
    } catch (error) {
      const modalError = document.querySelector('.fetchWordsCollectionError');

      if (!modalError) {
        const messageModal = new MessageModal();
        messageModal.appendSelf('fetchWordsCollectionError');
      }

      MessageModal.showModal('Sorry, something went wrong. Try again, please.', undefined, 'fetchWordsCollectionError');
    }
  }

  getWordDifficulty(event) {
    if (!event.target.classList.contains('difficulty-level') || this.isMarkedWordLevel) {
      return;
    }

    this.isMarkedWordLevel = true;
    this.wordLevel = event.target.value;
    this.nextCard();
  }

  showHardButton() {
    if (this.isMarkedHardWord) {
      this.markedHardWord.classList.add('hidden');
      this.unmarkedHardWord.classList.remove('hidden');
    } else {
      this.markedHardWord.classList.remove('hidden');
      this.unmarkedHardWord.classList.add('hidden');
    }
  }

  async markDifficultWord() {
    try {
      if (this.isMarkedHardWord) {
        const wordId = this.wordData._id; // eslint-disable-line no-underscore-dangle
        await Repository.unmarkWordAsHard(wordId);
        this.isMarkedHardWord = false;
        this.showHardButton();
      } else {
        const wordId = this.wordData._id; // eslint-disable-line no-underscore-dangle
        await Repository.markWordAsHard(wordId);
        this.isMarkedHardWord = true;
        this.showHardButton();
      }
    } catch (error) {
      const modalError = document.querySelector('.fetchWordsCollectionError');
      if (!modalError) {
        const messageModal = new MessageModal();
        messageModal.appendSelf('fetchWordsCollectionError');
      }
      MessageModal.showModal('Sorry, something went wrong. Try again, please.', undefined, 'fetchWordsCollectionError');
    }
  }

  setEventListener() {
    this.showAnswerButton.addEventListener('click', this.showRightAnswer.bind(this));
    this.checkWordButton.addEventListener('click', this.checkWord.bind(this));
    this.nextCardButton.addEventListener('click', this.nextCard.bind(this));
    this.repeatWordButton.addEventListener('click', this.repeatWord.bind(this));
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
