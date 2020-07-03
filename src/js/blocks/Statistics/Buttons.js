export default class Buttons {
  constructor(shortStatistics) {
    this.shortStatistics = shortStatistics;
    this.buttonShowTodayStat = document.querySelector('.statistics-today');
    this.buttonShowAllTimeStat = document.querySelector('.statistics-all-time');
  }

  setEventListeners() {
    this.buttonShowTodayStat.addEventListener('click', () => this.shortStatistics.showModal());
  }
}
