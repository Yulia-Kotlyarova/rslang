import { gameData } from './appState';

export class Phrases {
  static async fetchWordsCollection() {
    gameData.wordsCollection.length = 0;
    const url = `https://afternoon-falls-25894.herokuapp.com/words?group=${gameData.level}&page=${gameData.page}&wordsPerExampleSentenceLTE=10&wordsPerPage=10`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
  }

  static getPhrasesToDisplay(wordsCollection) {
    let phrasesToDisplay = [];
    const wordsLengthOfAllPhrases = [];
    wordsCollection.forEach((wordData) => phrasesToDisplay.push(wordData.textExample));
    phrasesToDisplay = phrasesToDisplay.map((phrase) => phrase.replace(/<b>/g, '').replace(/<\/b>/g, '').split(' '));
    phrasesToDisplay.forEach((phrase) => {
      wordsLengthOfAllPhrases.push(Phrases.countWordsLengthProportion(phrase));
    });
    return { phrasesToDisplay, wordsLengthOfAllPhrases };
  }

  static countWordsLengthProportion(phrase) {
    const phraseWhithoutSpaces = phrase.join('').replace(/\s/g, '');
    const wordsLength = [];
    phrase.forEach((word) => {
      wordsLength.push(word.length / phraseWhithoutSpaces.length);
    });
    return wordsLength;
  }
}

export const phrases = new Phrases();
