export default class Results {
  constructor(startNewGame, savannahState) {
    this.startNewGame = startNewGame;
    this.savannahState = savannahState;
    this.answersArea = document.querySelector('.game__answers');
    this.activeWordContainer = document.querySelector('.game__active-word');
    this.resultsContainer = document.querySelector('.results');
    this.mistakesNumber = document.querySelector('.mistakes__number');
    this.correctNumber = document.querySelector('.correct__number');
    this.mistakesWords = document.querySelector('.mistakes__words');
    this.correctWords = document.querySelector('.correct__words');
    this.resultsKnowledge = document.querySelector('.results__knowledge');
  }

  defineNextlevelAndPage() {
    if (this.savannahState.currentRound === 29) {
      if (this.savannahState.currentLevel === 5) {
        this.savannahState.currentLevel = 0;
        this.savannahState.currentRound = 0;
      } else {
        this.savannahState.currentLevel += 1;
        this.savannahState.currentRound = 0;
      }
    } else {
      this.savannahState.currentRound += 1;
    }
  }

  setAudioEventListeners() {
    this.resultsKnowledge.addEventListener('click', (event) => {
      const clickedIcon = event.target.closest('.results__audio-play');
      if (clickedIcon) {
        this.audioPlay(clickedIcon);
      }
    });
  }

  audioPlay(clickedIcon) {
    const phraseNumber = clickedIcon.getAttribute('audioSrcID');
    const soundToPlay = `https://raw.githubusercontent.com/anna234365/rslang-data/master/data/${this.savannahState.wordsCollection[phraseNumber].audio.slice(6)}`;
    const audio = new Audio();
    audio.src = soundToPlay;
    audio.autoplay = true;
  }

  showResults() {
    this.resultsContainer.classList.remove('hidden');
    this.mistakesNumber.innerText = this.savannahState.answeredWrong.length;
    this.correctNumber.innerText = this.savannahState.answeredCorrect.length;
    this.mistakesWords.innerHTML = '';
    this.correctWords.innerHTML = '';

    this.savannahState.answeredWrong.forEach((wordNumber) => {
      const audioPlay = `<div class="results__audio-play" audioSrcID=${wordNumber}><i class="fas fa-music"></i></div>`;
      const wordEN = `<div class="word_EN">${this.savannahState.wordsCollection[wordNumber].word}</div>`;
      const wordRU = `<div class="word_RU">${this.savannahState.wordsCollection[wordNumber].wordTranslate}</div>`;
      this.mistakesWords.innerHTML += `<div class="results__words__container">${audioPlay} <div class="results__word">${wordEN} ${wordRU}</div></div>`;
    });
    this.savannahState.answeredCorrect.forEach((wordNumber) => {
      const audioPlay = `<div class="results__audio-play" audioSrcID=${wordNumber}><i class="fas fa-music"></i></div>`;
      const wordEN = `<div class="word_EN">${this.savannahState.wordsCollection[wordNumber].word}</div>`;
      const wordRU = `<div class="word_RU">${this.savannahState.wordsCollection[wordNumber].wordTranslate}</div>`;
      this.correctWords.innerHTML += `<div class="results__words__container">${audioPlay} <div class="results__word">${wordEN} ${wordRU}</div></div>`;
    });
    this.setAudioEventListeners();
  }
}
