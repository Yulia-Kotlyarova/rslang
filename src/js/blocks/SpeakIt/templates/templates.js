import createElementFromHTML from './elementCreater';

const templates = {
  card: (word) => createElementFromHTML(`
    <div class="card" data-word="${word.word}" data-translation="${word.wordTranslate}">
        <span class="card__audio-icon ">
            <i class="fas fa-volume-down fa-2x"></i>
        </span>
        <p class="card__word">${word.word}</p>
        <p class="card__transcription">${word.transcription}</p>
        <p class="card__translation">${word.wordTranslate}</p>
    </div>
  `),

  star: () => createElementFromHTML(`
    <div class="star"></div>
  `),

  gameItem: (game) => createElementFromHTML(`
    <div class="games-played__game">${game.date}. Level: ${game.level}. Guessed: ${game.guessed}, not guessed: ${game.errors}.</div>
  `),
};

export default templates;