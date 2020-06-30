import '../../../sass/styles.scss';

import 'bootstrap/js/dist/tab';

import Authorization from '../../modules/Authorization';
import MessageModal from '../../modules/MessageModal';

window.onload = () => {
  if (Authorization.isSignedUp() && !Authorization.isTokenExpired()) {
    window.location.href = 'index.html';
    return;
  }

  localStorage.clear();

  const authorization = new Authorization();
  authorization.setEventListeners();

  const messageModal = new MessageModal();
  messageModal.appendSelf('authorization___modal');
};
