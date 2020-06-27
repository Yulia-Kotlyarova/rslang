const wordArray1 = [];
const wordArray2 = [];
const wordArray3 = [];
export { wordArray1, wordArray2, wordArray3 };

const fetchWords = (api) => {
  fetch(api)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((val) => wordArray1.push(val.word));
      data.forEach((val) => wordArray2.push(val.wordTranslate));
      data.forEach((val) => wordArray3.push(val.audio));
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

console.log(wordArray1);
console.log(wordArray2);
console.log(wordArray3);
