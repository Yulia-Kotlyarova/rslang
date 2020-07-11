import $ from 'jquery';
import 'bootstrap/js/dist/modal';
import { savannahState } from './appState';
import StartNewGame from './StartNewGame';
import StartNewRound from './StartNewRound';
import Repository from '../../modules/Repository';

export default class NavigationModal {
  constructor() {
    this.body = document.querySelector('body');
  }

  static createModalHTML() {
    const savannahStatistic = JSON.parse(localStorage.getItem('savannahStatistic'));
    let theadTds = '<td></td>';
    for (let i = 0; i < 6; i += 1) {
      theadTds += `<td class="cell-with-data cell-level">level ${i + 1}</td>`;
    }
    let trows = '';
    for (let i = 0; i < 30; i += 1) {
      const rowStart = `<tr><td class="cell-with-data cell-round">round ${i + 1}</td>`;
      let rowMiddleCells = '';
      for (let x = 0; x < 6; x += 1) {
        if (savannahStatistic[`${x}.${i}`]) {
          const [correct, wrong, date] = savannahStatistic[`${x}.${i}`];
          let className = '';
          if (correct === 20) {
            className = 'navigation-table-green';
          } else if (correct > 0) {
            className = 'navigation-table-yellow';
          } else {
            className = 'navigation-table-red';
          }
          rowMiddleCells += `<td class="${className} cell-with-data cell-navigate" id=${x}.${i}
            data-toggle="tooltip"
            data-placement="top"
            title="Last played: ${date}">Correct: ${correct} <br> Wrong: ${wrong}
            </td>`;
        } else {
          rowMiddleCells += `<td class="navigation-table-grey cell-with-data cell-navigate" id=${x}.${i}>never<br>played</td>`;
        }
      }
      trows += `${rowStart}${rowMiddleCells}</tr>`;
    }

    const tableHTML = `
    <table class="navigation-table">
      <thead>
        <tr>
          ${theadTds}
        </tr>
      </thead>
      <tbody>
        ${trows}
      </tbody>
    </table>`;
    let userWordsTableCells = '';
    for (let i = 0; i < 6; i += 1) {
      if (savannahStatistic[`level_${i}`]) {
        const [correct, wrong, date] = savannahStatistic[`level_${i}`];
        let className = '';
        if (correct === 20) {
          className = 'navigation-table-green';
        } else if (correct > 0) {
          className = 'navigation-table-yellow';
        } else {
          className = 'navigation-table-red';
        }
        userWordsTableCells += `
        <td class="user-words__level ${className}"
        level=${i + 1}
        data-toggle="tooltip"
        data-placement="top"
        title="Last played: ${date}">
        Level ${i + 1}<br>
        Correct: ${correct}<br>
        Wrong: ${wrong}</td>
        `;
      } else {
        userWordsTableCells += `
        <td class="user-words__level navigation-table-grey"
        level=${i + 1}
        data-toggle="tooltip"
        data-placement="top"
        title="Never played">
        Level ${i + 1}<br>
        Correct: -<br>
        Wrong: -</td>
        `;
      }
    }
    const userWordsTable = `
    <table class="user-words-table">
      <tbody>
        <tr>
        ${userWordsTableCells}
        </tr>
      </tbody>
    </table>`;

    return `
      <div class="modal fade savannah-navigation-modal" tabindex="-1" role="dialog" aria-labelledby="message-modal__title" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title message-modal__title" id="message-modal__title">Navigation & Statistics</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
                  <div class="modal-body">
                    <h4>PLAY WITH YOUR WORDS</h4>
                    <span>Choose level - click on it</span>
                    <div class="navigation__user-words">
                    ${userWordsTable}
                    </div>
                    <div class="not-enough-words">Not enough user words in this level yet. Please play with ALL words.</div>
                    <h4>PLAY WITH ALL WORDS</h4>
                    <span>Choose level and round. Click on cells to navigate</span>
                    ${tableHTML}
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  </div>
              </div>
          </div>
      </div>
    `;
  }

  static showModal(closeCallback) {
    const modal = document.querySelector('.savannah-navigation-modal');
    $(modal).modal('show');

    if (closeCallback) {
      $(modal).on('hidden.bs.modal', () => {
        closeCallback(modal);
      });
    }

    modal.addEventListener('click', (event) => NavigationModal.navigate(event));
  }

  appendSelf() {
    this.modalHTML = NavigationModal.createModalHTML();
    this.body.insertAdjacentHTML('beforeend', this.modalHTML);
  }

  static delete(modal) {
    document.body.removeChild(modal);
  }

  static async navigate(event) {
    const notEnoughWordsMessage = document.querySelector('.not-enough-words');
    notEnoughWordsMessage.classList.remove('not-enough-words_show');
    if (event.target.classList.contains('cell-navigate')) {
      savannahState.userWords = false;
      const eventTargetIdData = event.target.id.split('.');
      const [level, round] = eventTargetIdData;
      savannahState.currentLevel = Number(level);
      savannahState.currentRound = Number(round);
      const modal = document.querySelector('.savannah-navigation-modal');
      const modalOverlay = document.querySelector('.modal-backdrop');
      document.body.removeChild(modal);
      document.body.removeChild(modalOverlay);
      const startPage = document.querySelector('.start-page');
      startPage.classList.add('hidden');
      const startNewRound = new StartNewRound(savannahState);
      const startNewGame = new StartNewGame(savannahState, startNewRound);
      startNewGame.startGame();
    } else if (event.target.classList.contains('user-words__level')) {
      const level = Number(event.target.getAttribute('level')) - 1;
      savannahState.wordsCollection = await Repository.getAllUserWords(level, 20);
      if (savannahState.wordsCollection.length < 20) {
        notEnoughWordsMessage.classList.add('not-enough-words_show');
      } else {
        savannahState.userWords = true;
        savannahState.userWordsLevel = level;
        const modal = document.querySelector('.savannah-navigation-modal');
        const modalOverlay = document.querySelector('.modal-backdrop');
        document.body.removeChild(modal);
        document.body.removeChild(modalOverlay);
        const startPage = document.querySelector('.start-page');
        startPage.classList.add('hidden');
        const startNewRound = new StartNewRound(savannahState);
        const startNewGame = new StartNewGame(savannahState, startNewRound);
        startNewGame.startGame();
      }
    }
  }
}
