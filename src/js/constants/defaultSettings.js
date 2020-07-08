const defaultSettings = {
  wordsPerDay: 20,
  maxCardsPerDay: 50,

  isTranslationVisible: true,
  isExplanationVisible: true,
  isExampleVisible: true,

  isTranscriptionVisible: true,
  isPictureVisible: true,

  isShowAnswerButtonVisible: true,
  isRemoveButtonVisible: true,
  isDifficultButtonVisible: true,
  areAdditionalButtonsVisible: true,

  isSoundAutoPlay: true,

  wordsToStudy: 'mixed',
};

export default defaultSettings;

export const scrambleMsg = document.querySelector('.sectionStart__msg');
export const audioT = document.getElementById('audioT');
