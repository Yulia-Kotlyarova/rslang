import 'bootstrap/js/dist/collapse';
import '../../../sass/styles.scss';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faCogs } from '@fortawesome/free-solid-svg-icons';

import Header from '../../modules/Header';
import Repository from '../../modules/Repository';
import Card from './modules/Card';
import SettingsModal from './modules/SettingsModal';

import 'bootstrap/js/dist/modal';

library.add(faCogs);

dom.watch();

window.onload = async () => {
  if (!localStorage.getItem('token')) {
    document.location.href = 'authorization.html';
  }

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
