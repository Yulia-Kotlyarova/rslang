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

export const getWordsFromBackend = (level) => {
  for (let i = 0; i < 3; i += 1) {
    const api = `https://afternoon-falls-25894.herokuapp.com/words?page=${i}&group=${level}`;
    fetchWords(api);
  }
};
