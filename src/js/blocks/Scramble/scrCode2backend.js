import Repository from '../../modules/Repository';

const arrayWord = [];
const arrayWordTranslate = [];
const arrayAudio = [];
const arraySentence = [];
const arrayTranscription = [];
const arrayImage = [];
const arrayWordId = [];

export {
  arrayWord, arrayWordTranslate, arrayAudio, arraySentence, arrayTranscription,
  arrayImage, arrayWordId,
};

const fetchWords = (api) => {
  fetch(api)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((val) => {
        arrayWord.push(val.word);
        arrayWordTranslate.push(val.wordTranslate);
        arrayAudio.push(val.audio);
        arraySentence.push(val.textMeaningTranslate);
        arrayTranscription.push(val.transcription);
        arrayImage.push(val.image);
        arrayWordId.push(val.id);
      });
    })
    .catch(() => {
    });
};

const fetchMixedWords = (j) => {
  Repository.getMixedWords(j, 15).then((result) => {
    result.forEach((val) => {
      arrayWord.push(val.word);
      arrayWordTranslate.push(val.wordTranslate);
      arrayAudio.push(val.audio);
      arraySentence.push(val.textMeaningTranslate);
      arrayTranscription.push(val.transcription);
      arrayImage.push(val.image);
    });
  });
};

export const wordsFromDictionary = (level) => {
  if (level === 'Learnt words' || level === 'Изученные слова') {
    for (let j = 0; j < 6; j += 1) {
      fetchMixedWords(j);
    }
  } else {
    for (let i = 0; i < 2; i += 1) {
      const api = `https://afternoon-falls-25894.herokuapp.com/words?page=${i}&group=${level}`;
      fetchWords(api);
    }
  }
};
