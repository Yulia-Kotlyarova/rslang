import 'bootstrap/js/dist/collapse';
import '../../../sass/styles.scss';

import '@fortawesome/fontawesome-free/js/all.min';
import Header from '../../modules/Header';
import Repository from '../../modules/Repository';
import Card from './modules/Card';
import SettingsModal from './modules/SettingsModal';

import 'bootstrap/js/dist/modal';

window.onload = async () => {
  const header = new Header();
  header.run();

  const settingsModal = new SettingsModal();
  await settingsModal.initiate();

  const card = new Card();
  await card.getWord();
  card.showCard();
  card.setEventListener();

  const statistics = await Repository.getStatistics();
  localStorage.setItem('statistics', JSON.stringify(statistics));
};
