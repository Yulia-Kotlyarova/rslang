import '../../../sass/styles.scss';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faVolumeDown, faTrashRestore } from '@fortawesome/free-solid-svg-icons';

import 'bootstrap/js/dist/tab';
import 'bootstrap/js/dist/collapse';

import Header from '../../modules/Header';
import MessageModal from '../../modules/MessageModal';

import App from './modules/App';
import Authorization from '../../modules/Authorization';

if (!Authorization.isSignedUp()) {
  window.location.href = 'promo.html#unauthorized';
} else {
  (async () => {
    await Authorization.getFreshToken();
  })();
}

library.add(faVolumeDown);
library.add(faTrashRestore);

dom.watch();

window.onload = async () => {
  const header = new Header();
  header.run();

  const messageModal = new MessageModal();
  messageModal.appendSelf('authorization___modal');

  const app = new App();
  await app.initiate();
};
