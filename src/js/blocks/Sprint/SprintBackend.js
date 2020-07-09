import Repository from '../../modules/Repository';

const wordArrayWords = [];
const wordArrayTranslation = [];
const wordArrayAudios = [];
export { wordArrayWords, wordArrayTranslation, wordArrayAudios };

const fetchWords = (api) => {
  fetch(api)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((val) => {
        wordArrayWords.push(val.word);
        wordArrayTranslation.push(val.wordTranslate);
        wordArrayAudios.push(val.audio);
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
