class Recognition {
  constructor(app) {
    this.app = app;

    this.recognition = new window.SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.addEventListener('result', async (event) => {
      const word = event.results[event.results.length - 1][0].transcript;
      this.app.mainPage.inputDisplay.setAttribute('value', word);
      await this.app.game.compareWords(word);
    });
  }
}

export default Recognition;
