import '../../../sass/styles.scss';

import 'bootstrap/js/dist/tab';

import Authorization from '../../modules/Authorization';

window.onload = () => {
  if (Authorization.isSignedUp() && !Authorization.isTokenExpired()) {
    window.location.href = 'index.html';
  }

  const authorization = new Authorization();
  authorization.setEventListeners();
};
