import '../../../sass/styles.scss';
import 'bootstrap/js/dist/collapse';
import '@fortawesome/fontawesome-free/js/all.min';
import Header from '../../modules/Header';
import Chart from './Chart';
import Buttons from './Buttons';

import ShortStatistics from './ShortStatistics';

const chart = new Chart();
const shortStatistics = new ShortStatistics();
const buttons = new Buttons(shortStatistics);

window.onload = () => {
  const header = new Header();
  header.run();
  chart.renderUserChart();
  chart.setEventListeners();
  buttons.setEventListeners();
};
