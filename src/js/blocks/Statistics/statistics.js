import '../../../sass/styles.scss';
import Header from '../../modules/Header';
import Chart from './Chart';
import Buttons from './Buttons';
import ShortStatistics from './ShortStatistics';
import StatisticCalendar from './StatisticCalendar';

const chart = new Chart();
const shortStatistics = new ShortStatistics();
const buttons = new Buttons(shortStatistics, chart);
const statisticCalendar = new StatisticCalendar();

window.onload = async () => {
  const header = new Header();
  header.run();
  await chart.renderUserChart();
  chart.setEventListeners();
  buttons.setEventListeners();
  await statisticCalendar.creatCalendar();
};
