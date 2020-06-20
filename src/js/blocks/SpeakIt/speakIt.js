import '../../../sass/styles.scss';

import StartScreen from './modules/StartScreen';
import MainPage from './modules/MainPage';
import App from './modules/App';
import Game from './modules/Game';
import Recognition from './modules/Recognition';
import Result from './modules/Result';

window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

window.onload = async () => {
  const app = new App();
  await app.initiate();

  const game = new Game(app);

  const rec = new Recognition(app);

  const startScreen = new StartScreen(
    document.querySelector('.start-screen'),
    app,
  );
  startScreen.initiate();

  const result = new Result(
    document.querySelector('.results'),
    app,
  );
  result.initiate();

  const mainPage = new MainPage(
    document.querySelector('.container'),
    app,
  );
  mainPage.initiate();

  app.setMainPage(mainPage);
  app.setStartScreen(startScreen);
  app.setGame(game);
  app.setRec(rec);
  app.setResult(result);

  window.addEventListener('beforeunload', () => {
    game.finish();
  });
  window.addEventListener('unload', () => {
    game.finish();
  });
};
