import templates from '../templates/templates';

class Card {
  constructor(word) {
    const cardElement = templates.card(word);

    this.word = word.word.trim();
    this.cardElement = cardElement;
    this.image = word.image.trim();
    this.audio = word.audio.trim();
    this.translation = word.wordTranslate.trim();
  }

  playPronunciation() {
    new Audio(this.audio).play();
  }
}

export default Card;
