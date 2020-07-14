import '../../../sass/styles.scss';

import 'bootstrap/js/dist/tab';

import Authorization from '../../modules/Authorization';
import MessageModal from '../../modules/MessageModal';

window.onload = () => {
  if (Authorization.isSignedUp() && !Authorization.isTokenExpired()) {
    const hasBeenHereBefore = localStorage.getItem('hasBeenHereBefore');
    if (hasBeenHereBefore) {
      window.location.href = 'index.html';
    } else {
      localStorage.setItem('hasBeenHereBefore', 'true');
      window.location.href = 'promo.html';
    }
    return;
  }

  localStorage.clear();
  localStorage.setItem('app-language', 'en');

  const authorization = new Authorization();
  authorization.setEventListeners();

  const messageModal = new MessageModal();
  messageModal.appendSelf('authorization___modal');
};
