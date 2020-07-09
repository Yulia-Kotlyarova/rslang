import $ from 'jquery';
import 'bootstrap/js/dist/modal';
import Repository from '../../modules/Repository';
import getTodayShort from '../../helpers';
import MessageModal from '../../modules/MessageModal';

export default class ShortStatistics {
  constructor() {
    this.body = document.querySelector('body');
    this.modalHTML = null;
    this.cardsCompleted = 0;
    this.newWords = 0;
    this.correctAswers = 0;
    this.longestSession = 0;
  }

  async updateTodayStatisticsData() {
    const statistics = await Repository.getStatistics();
    const statisticsToday = await statistics.optional.dates[getTodayShort()] || null;
    if (statisticsToday) {
      this.cardsCompleted = statisticsToday.answersGivenToday;
      this.newWords = statisticsToday.learnedToday;
      this.correctAswers = `${Math.round((statisticsToday.correctToday / this.cardsCompleted) * 100, 0)}%`;
      this.longestSession = statisticsToday.correctMaximumSeriesToday;
    }
  }

  createModalHTML() {
    return `
      <div class="modal fade modal-short-statistics" tabindex="-1" role="dialog" aria-labelledby="message-modal__title" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                    <div class="short-statictics__title" id="message-modal__title" data-en="Daily session completed!" data-ru="Дневная норма выполнена!">Daily session completed!</div>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <div class="modal-body">
                    <div class="short-statictics__container">
                      <div class="short-statictics__data cards-completed">
                          <div class="data__title" data-en="Cards completed" data-ru="Пройдено карточек">Cards completed</div>
                          <div class="data__numbers">${this.cardsCompleted}</div>
                      </div>
                      <div class="short-statictics__data correct-answers">
                          <div class="data__title" data-en="Correct answers" data-ru="Правильных ответов">Correct answers</div>
                          <div class="data__numbers">${this.correctAswers}</div>
                      </div>
                      <div class="short-statictics__data new-words">
                          <div class="data__title" data-en="New words" data-ru="Новых слов">New words</div>
                          <div class="data__numbers">${this.newWords}</div>
                      </div>
                      <div class="short-statictics__data longest-session">
                          <div class="data__title" data-en="Longest session of correct answers" data-ru="Самая длинная серия правильных ответов">Longest session of correct answers</div>
                          <div class="data__numbers">${this.longestSession}</div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal" data-en="Close" data-ru="Закрыть">Close</button>
                  </div>
              </div>
          </div>
      </div>
    `;
  }

  async showModal() {
    try {
      await this.updateTodayStatisticsData();
      this.modalHTML = this.createModalHTML();
      this.body.insertAdjacentHTML('beforeend', this.modalHTML);
      const modal = document.querySelector('.modal-short-statistics');
      $(modal).modal('show');
      $(modal).on('hidden.bs.modal', () => {
        document.body.removeChild(modal);
      });
    } catch (error) {
      const messageModal = new MessageModal();
      MessageModal.createModalHTML('userChartError');
      messageModal.appendSelf('userChartError');
      MessageModal.showModal('Please sign in to see your statistics');
    }
  }
}
