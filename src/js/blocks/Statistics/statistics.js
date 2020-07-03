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

window.onload = async () => {
  const header = new Header();
  header.run();
  await chart.renderUserChart();
  chart.setEventListeners();
  buttons.setEventListeners();
};
