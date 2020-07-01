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
    this.todayStudiedWords = localStorage.getItem('todayStudiedWords') ? localStorage.getItem('todayStudiedWords') : 0;

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
    if (this.isMistake) {
      return;
    }
    this.isMistake = true;
    if ((this.actualWordsData.length - this.wordPositionInResponse)
      > this.mistakenWordRepeatInterval) {
      this.actualWordsData.splice(this.wordPositionInResponse + this.mistakenWordRepeatInterval,
        0, this.wordData);
    } else {
      this.actualWordsData.push(this.wordData);
    }
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
      this.wordField.innerHTML += `<span class="hidden" index="${i}">${this.word[i]}</span>`;
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
      console.log(this.wordTextExampleAudio);
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
    this.wordInput.innerHTML = '';
    this.wordField.innerHTML = '';
    this.wordInput.value = '';
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

  setWordDifficulty(event) {
    if (!event.target.classList.contains('difficulty-level')) {
      return;
    }
    const difficultyLevel = event.target.value;
    this.saveUserWord(difficultyLevel);
  }

  async saveUserWord(difficultyLevel) {
    const word = { difficulty: difficultyLevel, optional: { testFieldString: 'test', testFieldBoolean: true } };
    const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${this.userId}/words/${this.wordData.id}`, {
      method: 'POST',
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(word),
    });
    const content = await rawResponse.json();
    console.log(content);
  }

  setEventListener() {
    this.showAnswerButton.addEventListener('click', this.showRightAnswer.bind(this));
    this.checkWordButton.addEventListener('click', this.checkWord.bind(this));
    this.nextCardButton.addEventListener('click', this.nextCard.bind(this));
    this.repeatWordButton.addEventListener('click', this.repeatHardWord.bind(this));
    this.wordDifficultyLevel.addEventListener('click', this.setWordDifficulty.bind(this));

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
        this.checkWord();
      }
    });

    this.wordInput.addEventListener('input', () => {
      const hiddenRightWord = [...this.wordField.children];
      hiddenRightWord.forEach((item) => {
        const currentItem = item;
        currentItem.className = 'hidden';
      });
    });
  }
}

export default Card;
