import { savannahState } from './appState';

export function defineActiveRound() {
  let [level, page] = savannahState.lastPlayedRound.split('.');
  if (page === 29) {
    if (level === 5) {
      level = 0;
      page = 0;
    } else {
      level += 1;
      page = 0;
    }
  } else {
    page += 1;
  }
  return [level, page];
}

export async function getWordsCollection() {
  const level = savannahState.currentLevel;
  const page = savannahState.currentPage;
  const url = `https://afternoon-falls-25894.herokuapp.com/words?group=${level}&page=${page}`;
  const response = await fetch(url);
  const result = await response.json();
  // console.log(result);
  return result;
}

export function setWordsOrder() {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]; // подумать
  const arrLength = savannahState.wordsCollection.length;
  for (let i = arrLength - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

export function combineWordsAndAnswers() {
  // const random = 6 + Math.floor(Math.random() * (4));
  // console.log(mathRandomForAnswers)
  const arr = [];
  for (let i = 0; i < savannahState.wordsCollection.length; i += 1) {
    const x = savannahState.wordsOrder[i];
    const word = savannahState.wordsCollection[x];
    const answer1 = savannahState.wordsCollection[(x + 4) % 20];
    const answer2 = savannahState.wordsCollection[(x + 8) % 20];
    const answer3 = savannahState.wordsCollection[(x + 12) % 20];
    arr.push([word, answer1, answer2, answer3]);
  }
  return arr;
}
