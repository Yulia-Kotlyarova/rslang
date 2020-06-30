import '../../../sass/styles.scss';

import '@fortawesome/fontawesome-free/js/all.min';
import 'bootstrap/js/dist/collapse';

import Header from '../../modules/Header';

import StartScreen from './modules/StartScreen';
import MainPage from './modules/MainPage';
import App from './modules/App';
import Game from './modules/Game';
import Recognition from './modules/Recognition';
import Result from './modules/Result';

window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

const app = new App();
const game = new Game(app);
const rec = new Recognition(app);

window.onload = async () => {
  const startScreen = new StartScreen(
    document.querySelector('.start-screen'),
    app,
  );

  const result = new Result(
    document.querySelector('.results'),
    app,
  );

  const mainPage = new MainPage(
    document.querySelector('.container'),
    app,
  );

  const header = new Header();
  header.run();

  app.setMainPage(mainPage);
  app.setStartScreen(startScreen);
  app.setGame(game);
  app.setRec(rec);
  app.setResult(result);

  startScreen.initiate();
  result.initiate();
  mainPage.initiate();
  await app.initiate();
};
