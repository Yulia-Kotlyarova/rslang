class StartScreen {
  constructor(startScreenElement, app) {
    this.startScreenElement = startScreenElement;
    this.app = app;

    this.startButton = startScreenElement.querySelector('.start-screen__button');
  }

  hide() {
    this.startScreenElement.classList.add('start-screen_hide');
  }

  show() {
    this.startScreenElement.classList.remove('start-screen_hide');
  }

  initiate() {
    this.startButton.addEventListener('click', async () => {
      await this.app.render('mainPage');
    });
  }
}

export default StartScreen;
