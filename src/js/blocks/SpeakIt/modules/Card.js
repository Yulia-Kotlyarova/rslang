class Card {
  constructor(template, word) {
    const cardElement = template.cloneNode(true);

    cardElement.setAttribute('data-word', word.word);
    cardElement.querySelector('.card__word').innerText = word.word;
    cardElement.querySelector('.card__transcription').innerText = word.transcription;
    // cardElement.querySelector('.card__translation').innerText = word.transcription;

    this.word = word.word;
    this.cardElement = cardElement;
    this.image = word.image;
    this.audio = word.audio;
  }
}

export default Card;
