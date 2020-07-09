import Repository from '../../modules/Repository';

export default class StatisticCalendar {
  constructor() {
    this.calendarContainer = document.querySelector('.calendar__container');
    this.statistics = null;
    this.allDates = null;
    this.error = null;
  }

  async creatCalendar() {
    try {
      this.statistics = await Repository.getStatistics();
      this.allDates = Object.keys(this.statistics.optional.dates).reverse();
    } catch (error) {
      this.allDates = [];
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
          <td>${answersGivenToday || 0}</td>
          <td>${learnedToday || 0}</td>
        </tr>
        `;
        calendarTableHTML += tableLine;
      });
    }
    this.calendarContainer.innerHTML = `${calendarTableHTML}</tbody><table>`;
  }
}
