import '../../../sass/styles.scss';

import '@fortawesome/fontawesome-free/js/all.min';

import 'bootstrap/js/dist/tab';

import Header from '../../modules/Header';
import MessageModal from '../../modules/MessageModal';

import App from './modules/App';

window.onload = async () => {
  const header = new Header();
  header.run();

  const app = new App();
  await app.initiate();

  const messageModal = new MessageModal();
  messageModal.appendSelf('authorization___modal');
};
