import Repository from '../../modules/Repository';

export default class StatisticCalendar {
  constructor() {
    this.calendarContainer = document.querySelector('.calendar__container');
    this.statistics = null;
    this.allDates = null;
    this.error = null;
    this.additionalRows = '<tr><td></td><td>0</td><td>0</td></tr>'.repeat(20); // для образца
  }

  async creatCalendar() {
    try {
      this.statistics = await Repository.getStatistics();
      this.allDates = Object.keys(this.statistics.optional.dates).reverse();
    } catch (error) {
      this.error = error; // так можно? чтобы ничего не делать с ошибкой
    }
    this.createTable();
  }

  createTable() {
    let calendarTableHTML = `
    <table>
      <thead>
        <tr>
          <td>Date</td><td>Cards Played</td><td>New Words</td>
        </tr>
      </thead>
      <tbody>
    `;
    if (this.allDates) {
      this.allDates.forEach((date) => {
        const { learnedToday, answersGivenToday } = this.statistics.optional.dates[date];
        const tableLine = `
        <tr>
          <td>${date}</td>
          <td>${answersGivenToday}</td>
          <td>${learnedToday}</td>
        </tr>
        `;
        calendarTableHTML += tableLine;
      });
    }
    calendarTableHTML += this.additionalRows;
    this.calendarContainer.innerHTML = `${calendarTableHTML}</tbody><table>`;
  }
}
