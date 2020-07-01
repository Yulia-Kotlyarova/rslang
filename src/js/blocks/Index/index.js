import '../../../sass/styles.scss';

import '@fortawesome/fontawesome-free/js/all.min';

import 'bootstrap/js/dist/modal';

import Card from './modules/Card';
import SettingsModal from './modules/SettingsModal';

window.onload = async () => {
  const settingsModal = new SettingsModal();
  await settingsModal.initiate();

  const card = new Card();
  await card.getWord();
  card.showCard();
  card.setEventListener();
};
