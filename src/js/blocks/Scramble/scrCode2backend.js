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

export const wordsFromDictionary = (level) => {
  for (let i = 0; i < 2; i += 1) {
    const api = `https://afternoon-falls-25894.herokuapp.com/words?page=${i}&group=${level}`;
    fetchWords(api);
  }
};

// setTimeout(() => {
//   console.log(arrayWord);
//   console.log(arrayImage);
// }, 1000);
