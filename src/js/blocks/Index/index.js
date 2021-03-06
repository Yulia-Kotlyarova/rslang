import 'bootstrap/js/dist/collapse';
import '../../../sass/styles.scss';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faCogs, faSync } from '@fortawesome/free-solid-svg-icons';

import Header from '../../modules/Header';
import Repository from '../../modules/Repository';
import Card from './modules/Card';
import SettingsModal from './modules/SettingsModal';

import 'bootstrap/js/dist/modal';
import Authorization from '../../modules/Authorization';

if (!Authorization.isSignedUp()) {
  window.location.href = 'promo.html#unauthorized';
} else {
  (async () => {
    await Authorization.getFreshToken();
  })();
}

library.add(faCogs);
library.add(faSync);

dom.watch();

window.onload = async () => {
  const header = new Header();
  header.run();

  const settingsModal = new SettingsModal();
  await settingsModal.initiate();

  const statistics = await Repository.getStatistics();
  localStorage.setItem('statistics', JSON.stringify(statistics));

  const card = new Card();
  await card.getWord();
  card.showCard();
  card.setEventListener();
};
