import '../../../sass/styles.scss';

import 'bootstrap/js/dist/tab';

import Authorization from '../../modules/Authorization';

window.onload = () => {
  const authorization = new Authorization();
  authorization.setEventListeners();
};
