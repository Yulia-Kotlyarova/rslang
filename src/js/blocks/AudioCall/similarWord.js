import shuffle from 'lodash/shuffle';
import partsOfSpeech from '../../constants/partsOfSpeech';
import similarWordTranslate from '../../constants/similarWordTranslate';

function findSimilar(word, requiredNumberOfWords) {
  // eslint-disable-next-line no-underscore-dangle
  const wordId = word.id || word._id;
  const partOfSpeech = partsOfSpeech[wordId];

  const wordEnd = word.wordTranslate.slice(-2);
  const sameEnd = similarWordTranslate[partOfSpeech].end[wordEnd];
  if (sameEnd.length > requiredNumberOfWords) {
    return shuffle(sameEnd.filter((wordTranslate) => wordTranslate !== word.wordTranslate));
  }

  const wordStart = word.wordTranslate.slice(0, 2);
  const sameStart = similarWordTranslate[partOfSpeech].start[wordStart];
  if (sameStart.length > requiredNumberOfWords) {
    return shuffle(sameStart.filter((wordTranslate) => wordTranslate !== word.wordTranslate));
  }

  const wordLength = word.wordTranslate.length;
  const sameLength = similarWordTranslate[partOfSpeech].lengthOfWord[wordLength];
  if (sameLength.length > requiredNumberOfWords) {
    return shuffle(sameLength.filter((wordTranslate) => wordTranslate !== word.wordTranslate));
  }

  return shuffle(
    [...sameEnd, ...sameStart, ...sameLength]
      .filter((wordTranslate) => wordTranslate !== word.wordTranslate),
  );
}

export default findSimilar;
