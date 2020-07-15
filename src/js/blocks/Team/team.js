import '../../../sass/styles.scss';
import 'bootstrap/js/dist/collapse';
import Header from '../../modules/Header';

window.onload = () => {
  const header = new Header();
  header.run();
};
