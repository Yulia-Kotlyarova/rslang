import $ from 'jquery';
import 'bootstrap/js/dist/modal';

export default class ShortStatistics {
  constructor() {
    this.body = document.querySelector('body');
    this.modalHTML = null;
    this.cardsCompleted = 0;
    this.newWords = 0;
    this.correctAswers = 0;
    this.longestSession = 0;
  }

  createModalHTML() {
    return `
      <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="message-modal__title" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                    <div class="short-statictics__title" id="message-modal__title">Daily session completed</div>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <div class="modal-body">
                    <div class="short-statictics__container">
                      <div class="short-statictics__data cards-completed">
                          <div class="data__title">Cards completed</div>
                          <div class="data__numbers">${this.cardsCompleted}</div>
                      </div>
                      <div class="short-statictics__data correct-answers">
                          <div class="data__title">Correct answers</div>
                          <div class="data__numbers">${this.newWords}</div>
                      </div>
                      <div class="short-statictics__data new-words">
                          <div class="data__title">New words</div>
                          <div class="data__numbers">${this.correctAswers}</div>
                      </div>
                      <div class="short-statictics__data longest-session">
                          <div class="data__title">Longest session of correct answers</div>
                          <div class="data__numbers">${this.longestSession}</div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  </div>
              </div>
          </div>
      </div>
    `;
  }

  // static showModal() {
  //   const modal = document.querySelector('.modal');
  //   $(modal).modal('show');

  // if (closeCallback) {
  //   $(modal).on('hidden.bs.modal', () => {
  //     closeCallback();
  //   });
  // }
  // }

  showModal() {
    this.modalHTML = this.createModalHTML();
    this.body.insertAdjacentHTML('beforeend', this.modalHTML);
    const modal = document.querySelector('.modal');
    $(modal).modal('show');
  }
}
