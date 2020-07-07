export default class Buttons {
  constructor(shortStatistics, chart) {
    this.shortStatistics = shortStatistics;
    this.chart = chart;
    this.buttonShowTodayStatistics = document.querySelector('.statistics-today-button');
    this.buttonRefreshChart = document.querySelector('.chart-range-refresh');
  }

  setEventListeners() {
    this.buttonShowTodayStatistics.addEventListener('click', () => this.shortStatistics.showModal());
    this.buttonRefreshChart.addEventListener('click', () => this.chart.renderUserChart());
  }
}
