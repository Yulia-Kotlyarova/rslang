import 'bootstrap/js/dist/collapse';
import '../../../sass/styles.scss';

import Header from '../../modules/Header';
import Repository from '../../modules/Repository';
import Card from './modules/Card';
import SettingsModal from './modules/SettingsModal';

import 'bootstrap/js/dist/modal';

window.onload = async () => {
  if (!localStorage.getItem('id')) {
    document.location.href = '../../../authorization.html';
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
