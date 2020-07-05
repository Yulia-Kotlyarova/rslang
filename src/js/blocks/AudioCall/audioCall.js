/* eslint-disable no-plusplus */

import '../../../sass/styles.scss';
import 'bootstrap/js/dist/collapse';
import '@fortawesome/fontawesome-free/js/all.min';
import Header from '../../modules/Header';

export {
  showRightAnswer, getCard, sayWord,
  getWords, gameResult, nextCard, background,
} from '../../modules/AudioCall';

window.onload = () => {
  const header = new Header();
  header.run();
};
