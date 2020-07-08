/* eslint no-underscore-dangle: 0 */

import createElementFromHTML from './elementCreater';
import { formatDateTime } from '../../../helpers';

const templates = {
  dictionaryTabStart: ({
    wordCount, isUser, isHard, isDeleted,
  }) => createElementFromHTML(`
    <div>
        <h2 class="h2">
            ${isUser ? '<span data-en="Words in progress" data-ru="Изучаемые слова">Words in progress</span>' : ''}
            ${isHard ? '<span data-en="Hard words" data-ru="Сложные слова">Hard words</span>' : ''}
            ${isDeleted ? '<span data-en="Deleted words" data-ru="Удаленные слова">Deleted words</span>' : ''}
        </h2>
        <p><span data-en="Word count: " data-ru="Количество слов: ">Word count: </span>${wordCount}.</p>
        ${isHard ? '<a class="btn btn-danger mt-4 mb-3" href="./#hardWords" data-en="Learn hard words" data-ru="Учить сложные слова">Learn hard words</a>' : ''}
    </div>
  `),
  word: (word, settings) => {
    const now = Date.now();

    const repetitions = (
      word && word.userWord && word.userWord.optional && word.userWord.optional.repetitions
    ) || 0;

    const lastPlayedDate = (
      word && word.userWord && word.userWord.optional && word.userWord.optional.lastPlayedDate
    ) || 0;
    const playNextDate = (
      word && word.userWord && word.userWord.optional && word.userWord.optional.playNextDate
    ) || 0;

    const next = `${now > playNextDate ? '<span data-en="right now" data-ru="прямо сейчас">right now</span>' : formatDateTime(new Date(playNextDate))}`;

    const interval = playNextDate - lastPlayedDate;

    const isDeleted = word
      && word.userWord && word.userWord.optional && word.userWord.optional.isDeleted;
    const isHard = word && word.userWord && word.userWord.optional && word.userWord.optional.isHard;

    let progressHTML;
    if (interval > 31 * 24 * 60 * 60 * 1000) {
      progressHTML = `<p class="my-3 dictionary__progress_5">${'⬤'.repeat(5)}</p>`;
    } else if (interval > 7 * 24 * 60 * 60 * 1000) {
      progressHTML = `<p class="my-3 dictionary__progress_4">${'⬤'.repeat(4)}</p>`;
    } else if (interval > 24 * 60 * 60 * 1000) {
      progressHTML = `<p class="my-3 dictionary__progress_3">${'⬤'.repeat(3)}</p>`;
    } else if (interval > 10 * 60 * 1000) {
      progressHTML = `<p class="my-3 dictionary__progress_2">${'⬤'.repeat(2)}</p>`;
    } else {
      progressHTML = `<p class="my-3 dictionary__progress_1">${'⬤'.repeat(1)}</p>`;
    }

    return createElementFromHTML(`
      <div class="dictionary__word card-body mb-4 pb-5 border-bottom" data-id="${word._id}">
        <div class="row">
${
  settings.isPictureVisible
    ? `<img class="img img-fluid mr-4 dictionary__word-image" src="${word.image}"></img>`
    : ''
}
          <div class="flex-grow-1">
              <p class="dictionary__word-actual d-flex align-items-center">
                  <span class="h4 mr-3">${word.word}</span>
                  <span class="dictionary__word-audio text-warning mr-3">
                      <i class="fas fa-volume-down fa-2x"></i>
                  </span>
${
  isDeleted || isHard
    ? '<span class="dictionary__word-restore text-success ml-auto"><i class="fas fa-trash-restore fa-2x"></i></span>'
    : ''
}
              </p>
              <p class="dictionary__word-translation mb-3 h5">${word.wordTranslate}</p>

${
  settings.isExplanationVisible
    ? `<p class="">${word.textMeaning}</p>`
    : ''
}
${
  settings.isExampleVisible
    ? `<p class="">${word.textExample}</p>`
    : ''
}
${
  settings.isTranscriptionVisible
    ? `<p class="text-monospace my-3">${word.transcription}</p>`
    : ''
}
          ${progressHTML}
              <p>
                  <span data-en="Repetitions: " data-ru="Повторенрий: ">Repetitions: </span>${repetitions} |
                  <span> </span>
                  <span data-en="Last: " data-ru="Последнее: ">Last: </span>${lastPlayedDate ? formatDateTime(new Date(lastPlayedDate)) : '-'} |
${
  !isDeleted && !isHard && playNextDate
    ? `
      <span> </span>
      <span data-en="Next: " data-ru="Следующее: ">Next: </span>${next} |
    `
    : ''
}
              </p>
          </div>
        </div>
      </div>
    `);
  },
};

export default templates;
