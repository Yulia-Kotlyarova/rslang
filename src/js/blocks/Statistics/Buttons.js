export default class Buttons {
  constructor(shortStatistics) {
    this.shortStatistics = shortStatistics;
    this.buttonShowTodayStatistics = document.querySelector('.statistics-today');
    this.buttonShowAllTimeStatistics = document.querySelector('.statistics-all-time');
  }

  setEventListeners() {
    this.buttonShowTodayStatistics.addEventListener('click', async () => this.shortStatistics.showModal());
  }
}
