import { puzzlePadding, gameData } from './appState';
import drawPuzzleContour from './MyCanvas';

function getPuzzleElementPosition(i, phraseLength) {
  let puzzleElementPosition;
  if (i === 0) {
    puzzleElementPosition = 'first';
  } else if (i === phraseLength - 1) {
    puzzleElementPosition = 'last';
  } else {
    puzzleElementPosition = 'middle';
  }
  return puzzleElementPosition;
}

export function createPuzzleElements() {
  const testLine = document.querySelector('.game__game-line');
  const puzzleLines = testLine.querySelectorAll('.game__line');
  puzzleLines.forEach((puzzleLine, index) => {
    const puzzleLineTemp = puzzleLine;
    puzzleLineTemp.innerHTML = '';
    const phraseLength = gameData.phrasesToDisplay[index].length;

    for (let i = 0; i < phraseLength; i += 1) {
      const puzzleElementPosition = getPuzzleElementPosition(i, phraseLength);
      const puzzleElement = document.createElement('div');
      puzzleElement.classList.add('puzzle__element', 'puzzle__element_active');
      puzzleElement.setAttribute('draggable', 'true');
      puzzleElement.setAttribute('id', `line_${index}_word_${i}`);
      puzzleElement.style.width = `${gameData.puzzleEementsParameters[index][i][6]}px`;
      puzzleElement.style.height = `${gameData.puzzleEementsParameters[index][i][7]}px`;

      const puzzleElementCanvas = document.createElement('canvas');
      puzzleElementCanvas.classList.add('puzzle__element__canvas');

      const puzzleElementWord = document.createElement('div');
      puzzleElementWord.classList.add('puzzle__element__word');
      puzzleElementWord.innerText = gameData.phrasesToDisplay[index][i];

      const puzzleOverlayGreen = document.createElement('div');
      puzzleOverlayGreen.classList.add('puzzle__element__overlay_green', 'display-none');

      const puzzleOverlayRed = document.createElement('div');
      puzzleOverlayRed.classList.add('puzzle__element__overlay_red', 'display-none');

      puzzleElement.append(puzzleElementCanvas, puzzleElementWord,
        puzzleOverlayGreen, puzzleOverlayRed);
      puzzleLine.append(puzzleElement);

      drawPuzzleContour(puzzleElementCanvas, puzzleElementPosition);
    }
  });
}

export function calculatePuzzleEementsParameters(bgWidth, bgHeight) {
  const puzzle = document.querySelector('.puzzle');
  const totalWidth = puzzle.clientWidth;
  const totalHeight = puzzle.clientHeight;

  const widthProportion = bgWidth / totalWidth;
  const heightProportion = bgHeight / totalHeight;

  gameData.puzzleEementsParameters.length = 0;
  let heightCounterBackground = 0;

  gameData.phrasesToDisplay.forEach((phrase, phraseIndex) => {
    const arrWords = [];
    const lineWidthWithoutPaddings = totalWidth - puzzlePadding * (phrase.length * 3 + 1);
    let widthCounterBackground = 0;

    phrase.forEach((word, wordIndex) => {
      const elementWidth = lineWidthWithoutPaddings
      * gameData.wordsLengthOfAllPhrases[phraseIndex][wordIndex]
      + puzzlePadding * 4;
      const elementHeight = totalHeight / 10;
      const backgroundX = widthCounterBackground;
      const backgroundY = heightCounterBackground;
      const backgroundWidth = elementWidth * widthProportion;
      const backgroundHeight = elementHeight * heightProportion;
      const elementX = 0;
      const elementY = 0;

      widthCounterBackground += backgroundWidth - puzzlePadding * widthProportion;

      arrWords.push([backgroundX, backgroundY, backgroundWidth, backgroundHeight,
        elementX, elementY, elementWidth, elementHeight]);
    });
    heightCounterBackground += bgHeight / 10;
    gameData.puzzleEementsParameters.push(arrWords);
  });
}
