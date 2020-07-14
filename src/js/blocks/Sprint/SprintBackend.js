import Repository from '../../modules/Repository';

const wordArrayWords = [];
const wordArrayTranslation = [];
const wordArrayAudios = [];
const arrayWordId = [];
export {
  wordArrayWords, wordArrayTranslation, wordArrayAudios, arrayWordId,
};

const fetchWords = (api) => {
  fetch(api)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((val) => {
        wordArrayWords.push(val.word);
        wordArrayTranslation.push(val.wordTranslate);
        wordArrayAudios.push(val.audio);
        arrayWordId.push(val.id);
      });
    })
    .catch(() => {
    });
};

const fetchMixedWords = (j) => {
  Repository.getMixedWords(j, 10).then((result) => {
    result.forEach((val) => {
      wordArrayWords.push(val.word);
      wordArrayTranslation.push(val.wordTranslate);
      wordArrayAudios.push(val.audio);
      // eslint-disable-next-line no-underscore-dangle
      arrayWordId.push(val._id);
    });
  });
};

export const getWordsFromBackend = (level) => {
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
