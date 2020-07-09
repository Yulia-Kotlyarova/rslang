export const painting = document.querySelector('.puzzle__painting');
export const paintingInfo = document.querySelector('.game__line_painting-info');
export const resultsPainting = document.querySelector('.results__painting__image');
export const resultsPaintingInfo = document.querySelector('.results__painting__info');
export const puzzleLineNumbers = document.querySelectorAll('.puzzle__line-numbers div');
export const buttonStart = document.querySelector('.button__start');

export const backgroundPaiting = new Image();

export const puzzlePadding = 15;

export const gameData = {
  level: 0,
  page: 0,
  activePhrase: 0,
  wordsCollection: [],
  phrasesToDisplay: [],
  wordsLengthOfAllPhrases: [],
  canvasPuzzlesCoords: {},
  puzzleEementsParameters: [],
  imageData: {},
  gameResultsCorrect: [],
  gameResultsWrong: [],
  userWords: false,
  userWordsLevel: 0,
};

export const promptsSettings = {
  autoAudioPlay: true,
  audioPlay: true,
  translation: true,
  painting: false,
};

export const userAuthorization = {
  userId: '',
  token: '',
  email: '',
};

export const levelsAndPages = {
  0: 44,
  1: 40,
  2: 39,
  3: 28,
  4: 28,
  5: 23,
};

export const dragAndDropObjects = {
  gragged: '',
  targetLine: '',
  dropBefore: '',
};
