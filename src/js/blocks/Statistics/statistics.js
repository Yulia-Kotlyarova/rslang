import '../../../sass/styles.scss';
import 'bootstrap/js/dist/collapse';
import '@fortawesome/fontawesome-free/js/all.min';
import Header from '../../modules/Header';
import Chart from './Chart';

import ShortStatistics from './ShortStatistics';

const chart = new Chart();
const shortStatistics = new ShortStatistics();

window.onload = () => {
  const header = new Header();
  header.run();
  chart.setEventListeners();
  chart.renderUserChart();

  shortStatistics.showModal();
};
