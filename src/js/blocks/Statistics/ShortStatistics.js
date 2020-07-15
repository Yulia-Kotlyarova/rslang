import $ from 'jquery';
import 'bootstrap/js/dist/modal';
import Repository from '../../modules/Repository';
import getTodayShort from '../../helpers';
import MessageModal from '../../modules/MessageModal';
import Header from '../../modules/Header';

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
    const statisticsToday = statistics.optional.dates[getTodayShort()] || null;
    if (statisticsToday) {
      this.cardsCompleted = statisticsToday.answersGivenToday || 0;
      this.newWords = statisticsToday.learnedToday || 0;
      this.correctAswers = `${Math.round((statisticsToday.correctToday / statisticsToday.answersGivenToday) * 100, 0) || 0}%`;
      this.longestSession = statisticsToday.correctMaximumSeriesToday || 0;
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
                          <div class="data__title" data-en="New words learned" data-ru="Изучено новых слов">New words learned</div>
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
    function deleteErrorModal() {
      const userShortStatisticError = document.querySelector('.user-short-statistic-error');
      document.body.removeChild(userShortStatisticError);
    }
    try {
      await this.updateTodayStatisticsData();
      this.modalHTML = this.createModalHTML();
      this.body.insertAdjacentHTML('beforeend', this.modalHTML);
      Header.changeLanguage();
      const modal = document.querySelector('.modal-short-statistics');
      $(modal).modal('show');
      $(modal).on('hidden.bs.modal', () => {
        document.body.removeChild(modal);
      });
    } catch (error) {
      const messageModal = new MessageModal();
      MessageModal.createModalHTML('user-short-statistic-error');
      messageModal.appendSelf('user-short-statistic-error');
      MessageModal.showModal('Sorry, something went wrong', deleteErrorModal, 'user-short-statistic-error');
    }
  }
}
