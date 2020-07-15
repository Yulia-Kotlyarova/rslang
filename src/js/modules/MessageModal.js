import $ from 'jquery';
import 'bootstrap/js/dist/modal';

class MessageModal {
  constructor() {
    this.body = document.querySelector('body');
  }

  static createModalHTML(classname) {
    return `
      <div class="modal fade ${classname ? `${classname}` : ''}" tabindex="-1" role="dialog" aria-labelledby="message-modal__title" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title message-modal__title" id="message-modal__title" data-en="New message" data-ru="Новое сообщение">New message</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <div class="modal-body">
                      <p class="message-modal__message"></p>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal" data-en="Close" data-ru="Закрыть">Close</button>
                  </div>
              </div>
          </div>
      </div>
    `;
  }

  static showModal(message, closeCallback, className = 'modal') {
    const modal = document.querySelector(`.${className}`);
    const messageContainer = document.querySelector('.message-modal__message');

    messageContainer.innerText = message;
    $(modal).modal('show');

    if (closeCallback) {
      $(modal).on('hidden.bs.modal', () => {
        closeCallback();
      });
    }
  }

  appendSelf(className) {
    this.modalHTML = MessageModal.createModalHTML(className);
    this.body.insertAdjacentHTML('beforeend', this.modalHTML);
  }
}

export default MessageModal;
