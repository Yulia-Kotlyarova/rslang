import Repository from '../../modules/Repository';

const arrayWord = [];
const arrayWordTranslate = [];
const arrayAudio = [];
const arraySentence = [];
const arrayTranscription = [];
const arrayImage = [];
export {
  arrayWord, arrayWordTranslate, arrayAudio, arraySentence, arrayTranscription, arrayImage,
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
      });
      console.log(data);
    })
    .catch(() => {
    });
};

const fetchMixedWords = () => {
  Repository.getMixedWords(2, 20).then((result) => {
    result.forEach((val) => {
      arrayWord.push(val.word);
      arrayWordTranslate.push(val.wordTranslate);
      arrayAudio.push(val.audio);
      arraySentence.push(val.textMeaningTranslate);
      arrayTranscription.push(val.transcription);
      arrayImage.push(val.image);
    });
    console.log(result);
  });
};

export const wordsFromDictionary = (level) => {
  if (level === 'Выбери уровень' || level === 'Select level') {
    fetchMixedWords();
  } else {
    for (let i = 0; i < 2; i += 1) {
      const api = `https://afternoon-falls-25894.herokuapp.com/words?page=${i}&group=${level}`;
      fetchWords(api);
    }
  }
};
