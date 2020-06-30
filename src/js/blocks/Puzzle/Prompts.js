import { gameData, promptsSettings, backgroundPaiting } from './appState';

export default class Prompts {
  constructor() {
    this.promptAutoAudioPlay = document.querySelector('.button__prompt-auto-audio-play');
    this.promptAudioPlay = document.querySelector('.button__prompt-audio-play');
    this.promptAudioPlayOnce = document.querySelector('.button__audio-play-once');
    this.promptTranslation = document.querySelector('.button__prompt-translation');
    this.promptPainting = document.querySelector('.button__prompt-painting');
    this.gameLine = document.querySelector('.game__test-line');
    this.translationText = document.querySelector('.translation__text');
  }

  addEventListeners() {
    this.promptAutoAudioPlay.addEventListener('click', () => this.manageAutoAudioPlay());
    this.promptAudioPlay.addEventListener('click', () => this.manageAudioPlay());
    this.promptTranslation.addEventListener('click', () => this.manageTranslation());
    this.promptPainting.addEventListener('click', () => this.managePainting());
    this.promptAudioPlayOnce.addEventListener('click', () => Prompts.playPhraseAudio());
  }

  static getPromptsSettings() {
    const settings = JSON.parse(localStorage.getItem('EnglishPuzzle'));
    if (settings) {
      promptsSettings.autoAudioPlay = settings.autoAudioPlay;
      promptsSettings.audioPlay = settings.audioPlay;
      promptsSettings.translation = settings.translation;
      promptsSettings.painting = settings.painting;
    } else {
      localStorage.setItem('EnglishPuzzle', JSON.stringify(promptsSettings));
    }
  }

  applyPromptsSettings() {
    if (promptsSettings.autoAudioPlay) {
      this.promptAutoAudioPlay.classList.add('clicked');
    }
    if (promptsSettings.audioPlay) {
      this.promptAudioPlay.classList.add('clicked');
      this.promptAudioPlayOnce.classList.remove('display-none');
    }
    if (promptsSettings.translation) {
      this.promptTranslation.classList.add('clicked');
      this.translationText.classList.remove('display-none');
    }
    if (promptsSettings.painting) {
      this.promptPainting.classList.add('clicked');
      Prompts.addPuzzleBackground();
    }
  }

  static playPhraseAudio() {
    const soundToPlay = `https://raw.githubusercontent.com/anna234365/rslang-data/master/data/${gameData.wordsCollection[gameData.activePhrase].audioExample.slice(6)}`;
    const audio = new Audio();
    audio.src = soundToPlay;
    audio.autoplay = true;
  }

  manageAutoAudioPlay() {
    if (this.promptAutoAudioPlay.classList.contains('clicked')) {
      this.promptAutoAudioPlay.classList.remove('clicked');
      promptsSettings.autoAudioPlay = false;
      localStorage.setItem('EnglishPuzzle', JSON.stringify(promptsSettings));
    } else {
      this.promptAutoAudioPlay.classList.add('clicked');
      promptsSettings.autoAudioPlay = true;
      localStorage.setItem('EnglishPuzzle', JSON.stringify(promptsSettings));
    }
  }

  manageAudioPlay() {
    if (this.promptAudioPlay.classList.contains('clicked')) {
      this.promptAudioPlay.classList.remove('clicked');
      this.promptAudioPlayOnce.classList.add('display-none');
      promptsSettings.audioPlay = false;
      localStorage.setItem('EnglishPuzzle', JSON.stringify(promptsSettings));
    } else {
      this.promptAudioPlay.classList.add('clicked');
      this.promptAudioPlayOnce.classList.remove('display-none');
      promptsSettings.audioPlay = true;
      localStorage.setItem('EnglishPuzzle', JSON.stringify(promptsSettings));
    }
  }

  manageTranslation() {
    if (this.promptTranslation.classList.contains('clicked')) {
      this.translationText.classList.add('display-none');
      this.promptTranslation.classList.remove('clicked');
      promptsSettings.translation = false;
      localStorage.setItem('EnglishPuzzle', JSON.stringify(promptsSettings));
    } else {
      this.translationText.classList.remove('display-none');
      this.promptTranslation.classList.add('clicked');
      promptsSettings.translation = true;
      localStorage.setItem('EnglishPuzzle', JSON.stringify(promptsSettings));
    }
  }

  setTranslationText() {
    const translation = gameData.wordsCollection[gameData.activePhrase].textExampleTranslate;
    this.translationText.innerText = translation;
  }

  clearTranslationText() {
    this.translationText.innerText = '';
  }

  managePainting() {
    if (this.promptPainting.classList.contains('clicked')) {
      this.promptPainting.classList.remove('clicked');
      promptsSettings.painting = false;
      localStorage.setItem('EnglishPuzzle', JSON.stringify(promptsSettings));
      Prompts.removePuzzleBackground();
    } else {
      this.promptPainting.classList.add('clicked');
      promptsSettings.painting = true;
      localStorage.setItem('EnglishPuzzle', JSON.stringify(promptsSettings));
      Prompts.addPuzzleBackground();
    }
  }

  static addPuzzleBackgroundToCompletedPuzzles() {
    const activePuzzles = document.querySelectorAll('.puzzle__element_completed');
    activePuzzles.forEach((activePuzzle) => {
      const puzzleElementID = activePuzzle.getAttribute('id');
      const puzzleID = +puzzleElementID.slice(-1);
      const lineID = +puzzleElementID.slice(-8, -7);
      const [sX, sY, sW, sH, dX, dY, dW, dH] = gameData.puzzleEementsParameters[lineID][puzzleID];
      const puzzleCanvas = activePuzzle.querySelector('.puzzle__element__canvas');
      if (puzzleCanvas.getContext) {
        const ctx = puzzleCanvas.getContext('2d');
        ctx.drawImage(backgroundPaiting, sX, sY, sW, sH, dX, dY, dW, dH);
      }
    });
  }

  static addPuzzleBackground() {
    const activePuzzles = document.querySelectorAll('.puzzle__element_active');
    activePuzzles.forEach((activePuzzle) => {
      const puzzleElementID = activePuzzle.getAttribute('id');
      const puzzleID = +puzzleElementID.slice(-1);
      const lineID = +puzzleElementID.slice(-8, -7);
      const [sX, sY, sW, sH, dX, dY, dW, dH] = gameData.puzzleEementsParameters[lineID][puzzleID];
      const puzzleCanvas = activePuzzle.querySelector('.puzzle__element__canvas');
      if (puzzleCanvas.getContext) {
        const ctx = puzzleCanvas.getContext('2d');
        ctx.drawImage(backgroundPaiting, sX, sY, sW, sH, dX, dY, dW, dH);
      }
    });
  }

  static removePuzzleBackground() {
    const activePuzzles = document.querySelectorAll('.puzzle__element_active');
    activePuzzles.forEach((activePuzzle) => {
      const puzzleCanvas = activePuzzle.querySelector('.puzzle__element__canvas');
      if (puzzleCanvas.getContext) {
        const ctx = puzzleCanvas.getContext('2d');
        ctx.fill();
      }
    });
  }
}
