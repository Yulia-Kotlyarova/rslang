import '../../../sass/styles.scss';

import '@fortawesome/fontawesome-free/js/all.min';

import 'bootstrap/js/dist/index';
import 'bootstrap/js/dist/util';
import 'bootstrap/js/dist/button';
import 'bootstrap/js/dist/modal';

import SettingsModal from './modules/SettingsModal';

window.onload = () => {
  const settingsModal = new SettingsModal();

  settingsModal.initiate();
};
