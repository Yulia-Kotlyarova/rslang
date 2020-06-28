import 'bootstrap/js/dist/collapse';
import '../../../sass/styles.scss';
import '@fortawesome/fontawesome-free/js/all.min';
import Header from '../../modules/Header';

window.onload = () => {
  const header = new Header();
  header.run();
};
