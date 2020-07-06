import 'bootstrap/js/dist/collapse';
import '../../../sass/styles.scss';

import '@fortawesome/fontawesome-free/js/all.min';
import Header from '../../modules/Header';
import Card from './modules/Card';
import SettingsModal from './modules/SettingsModal';

import 'bootstrap/js/dist/modal';

window.onload = async () => {
  const header = new Header();
  header.run();

  const settingsModal = new SettingsModal();
  await settingsModal.initiate();

  const card = new Card();
  card.getWord();
  card.showCard();
  card.setEventListener();
};
