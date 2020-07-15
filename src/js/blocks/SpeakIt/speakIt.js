import '../../../sass/styles.scss';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faUser, faVolumeDown,
} from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/js/dist/collapse';

import Repository from '../../modules/Repository';

import Header from '../../modules/Header';

import StartScreen from './modules/StartScreen';
import MainPage from './modules/MainPage';
import App from './modules/App';
import Game from './modules/Game';
import Recognition from './modules/Recognition';
import Result from './modules/Result';

import MessageModal from '../../modules/MessageModal';

import Authorization from '../../modules/Authorization';

if (!Authorization.isSignedUp()) {
  window.location.href = 'promo.html#unauthorized';
} else {
  (async () => {
    await Authorization.getFreshToken();
  })();
}

window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

library.add(faUser);
library.add(faVolumeDown);

dom.watch();

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

  const messageModal = new MessageModal();
  messageModal.appendSelf('authorization___modal');

  app.setMainPage(mainPage);
  app.setStartScreen(startScreen);
  app.setGame(game);
  app.setRec(rec);
  app.setResult(result);

  result.initiate();
  mainPage.initiate();
  await app.initiate();

  startScreen.initiate();

  const statistics = await Repository.getStatistics();
  localStorage.setItem('statistics', JSON.stringify(statistics));
};
