import { gameData } from './appState';

export default class Results {
  constructor() {
    this.results = document.querySelector('.results');
    this.dontKnowNumber = document.querySelector('.dont-know__number');
    this.knowNumber = document.querySelector('.know__number');
    this.dontKnowPhrases = document.querySelector('.dont-know__phrases');
    this.knowPhrases = document.querySelector('.know__phrases');
    this.resultsKnowledge = document.querySelector('.results__knowledge');
    this.resultsButtonStatistic = document.querySelector('.button__statistics');
    this.buttonResults = document.querySelector('.button__results');
  }

  addEventListeners() {
    this.resultsKnowledge.addEventListener('click', (event) => {
      if (event.target.classList.contains('results__audio-play')) {
        const clickedIcon = event.target;
        Results.audioPlay(clickedIcon);
      }
    });
    this.buttonResults.addEventListener('click', () => this.showResults());
  }

  static audioPlay(clickedIcon) {
    const phraseNumber = clickedIcon.getAttribute('audioSrcID');
    const soundToPlay = `https://raw.githubusercontent.com/anna234365/rslang-data/master/data/${gameData.wordsCollection[phraseNumber].audioExample.slice(6)}`;
    const audio = new Audio();
    audio.src = soundToPlay;
    audio.autoplay = true;
  }

  showResults() {
    this.results.classList.remove('display-none');
    this.dontKnowNumber.innerText = gameData.gameResultsWrong.length;
    this.knowNumber.innerText = gameData.gameResultsCorrect.length;
    this.dontKnowPhrases.innerHTML = '';
    this.knowPhrases.innerHTML = '';

    gameData.gameResultsWrong.forEach((phraseNumber) => {
      const audioPlay = `<div class="results__audio-play" audioSrcID=${phraseNumber}></div>`;
      const phraseEN = `<div class="phrase_EN">${gameData.wordsCollection[phraseNumber].textExample.replace(/<\.?b>/g, '')}</div>`;
      const phraseRU = `<div class="phrase_RU">${gameData.wordsCollection[phraseNumber].textExampleTranslate}</div>`;
      this.dontKnowPhrases.innerHTML += `<div class="results__phrases__container">${audioPlay} <div class="results__phrase">${phraseEN} ${phraseRU}</div></div>`;
    });
    gameData.gameResultsCorrect.forEach((phraseNumber) => {
      const audioPlay = `<div class="results__audio-play" audioSrcID=${phraseNumber}></div>`;
      const phraseEN = `<div class="phrase_EN">${gameData.wordsCollection[phraseNumber].textExample.replace(/<\.?b>/g, '')}</div>`;
      const phraseRU = `<div class="phrase_RU">${gameData.wordsCollection[phraseNumber].textExampleTranslate}</div>`;
      this.knowPhrases.innerHTML += `<div class="results__phrases__container">${audioPlay} <div class="results__phrase">${phraseEN} ${phraseRU}</div></div>`;
    });
  }
}
