import '../../../sass/styles.scss';
import 'bootstrap/js/dist/collapse';
import '@fortawesome/fontawesome-free/js/all.min';
import Header from '../../modules/Header';
import Chart from './Chart';

const chart = new Chart();

window.onload = () => {
  const header = new Header();
  header.run();
  chart.setEventListeners();
  chart.renderUserChart();
};
