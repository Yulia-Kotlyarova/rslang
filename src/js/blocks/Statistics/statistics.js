import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import '../../../sass/styles.scss';
import Header from '../../modules/Header';
import Chart from './Chart';
import StatisticCalendar from './StatisticCalendar';

const chart = new Chart();
const statisticCalendar = new StatisticCalendar();
library.add(faRedo);
dom.watch();

window.onload = async () => {
  const header = new Header();
  header.run();
  await chart.renderUserChart();
  chart.setEventListeners();
  const buttonRefreshChart = document.querySelector('.chart-range-refresh');
  buttonRefreshChart.addEventListener('click', () => chart.renderUserChart());
  await statisticCalendar.creatCalendar();
};
