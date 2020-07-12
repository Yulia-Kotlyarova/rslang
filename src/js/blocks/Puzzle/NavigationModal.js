/* eslint-disable import/no-cycle */
import $ from 'jquery';
import 'bootstrap/js/dist/modal';
import { levelsAndPages, gameData } from './appState';
import StartNewGame from './startNewGame';
import Repository from '../../modules/Repository';

export default class NavigationModal {
  constructor() {
    this.body = document.querySelector('body');
  }

  static createModalHTML() {
    const puzzleStatistic = JSON.parse(localStorage.getItem('puzzleStatistic'));
    const language = localStorage.getItem('app-language');
    let titleCorrect = 'Correct: ';
    let titleWrong = 'Wrong: ';
    let titleLastPlayed = 'Last played: ';
    let neverPlayed = 'never <br> played';
    let modalTitle = 'Navigation & Statistics';
    let playWithLearnedWords = 'PLAY WITH LEARNED WORDS';
    let messageNorEnpughWords = 'Not enough learned words in this level yet. Please train cards or play with ALL words.';
    let userWordsInstruction = 'Choose level - click to navigate';
    let playWithAllWords = 'PLAY WITH ALL WORDS';
    let playWithAllWordsInstruction = 'Choose level and round - click to navigate';
    let closeButton = 'Close';
    let titleLevel = 'Level ';
    let titleRound = 'Round ';

    if (language === 'ru') {
      titleCorrect = 'Верно: ';
      titleWrong = 'Ошибки: ';
      titleLastPlayed = 'Последняя игра: ';
      neverPlayed = 'не <br> играли';
      modalTitle = 'Навигация и статистика';
      playWithLearnedWords = 'ИГРАТЬ СО СЛОВАМИ НА ИЗУЧЕНИИ';
      messageNorEnpughWords = 'Пока не достаточно изученных слов этого уровня. Продолжите тренировку с карточками либо играйте со всеми словами.';
      userWordsInstruction = 'Выбирайте уровень - кликайте для перемещения';
      playWithAllWords = 'ИГРАТЬ СО ВСЕМИ СЛОВАМИ';
      playWithAllWordsInstruction = 'Выбирайте уровень и раунд - кликайте для перемещения';
      closeButton = 'Закрыть';
      titleLevel = 'Уровень ';
      titleRound = 'Раунд ';
    }

    let theadTds = '<td></td>';
    for (let i = 0; i < 6; i += 1) {
      theadTds += `<td class="cell-with-data cell-level">${titleLevel}${i + 1}</td>`;
    }
    let trows = '';
    for (let i = 0; i < 45; i += 1) {
      const rowStart = `<tr><td class="cell-with-data cell-round">${titleRound}${i + 1}</td>`;
      let rowMiddleCells = '';
      for (let x = 0; x < 6; x += 1) {
        if (levelsAndPages[x] >= i) {
          if (puzzleStatistic[`${x}.${i}`]) {
            const [correct, wrong, date] = puzzleStatistic[`${x}.${i}`];
            let className = '';
            if (correct === 10) {
              className = 'navigation-table-green';
            } else if (correct > 0) {
              className = 'navigation-table-yellow';
            } else {
              className = 'navigation-table-red';
            }
            rowMiddleCells += `<td class="${className} cell-with-data cell-navigate" id=${x}.${i}
            data-toggle="tooltip"
            data-placement="top"
            title="Last played: ${date}">${titleCorrect}${correct}<br>${titleWrong}${wrong}
            </td>`;
          } else {
            rowMiddleCells += `<td class="navigation-table-grey cell-with-data cell-navigate" id=${x}.${i}>${neverPlayed}</td>`;
          }
        } else {
          rowMiddleCells += '<td></td>';
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
      if (puzzleStatistic[`level_${i + 1}`]) {
        const [correct, wrong, date] = puzzleStatistic[`level_${i + 1}`];
        let className = '';
        if (correct === 10) {
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
        title="${titleLastPlayed}${date}">
        ${titleLevel}${i + 1}<br>
        ${titleCorrect}${correct}<br>
        ${titleWrong}${wrong}</td>
        `;
      } else {
        userWordsTableCells += `
        <td class="user-words__level navigation-table-grey"
        level=${i + 1}>
        ${titleLevel}${i + 1}<br>
        ${neverPlayed}
        </td>`;
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
    <div class="modal fade puzzle-navigation-modal" tabindex="-1" role="dialog" aria-labelledby="message-modal__title" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title message-modal__title" id="message-modal__title">${modalTitle}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
            <div class="modal-body">
              <h4>${playWithLearnedWords}</h4>
              <span>${userWordsInstruction}</span>
              <div class="navigation__user-words">
              ${userWordsTable}
              </div>
              <div class="not-enough-words">${messageNorEnpughWords}</div>
              <h4>${playWithAllWords}</h4>
              <span>${playWithAllWordsInstruction}</span>
              ${tableHTML}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">${closeButton}</button>
            </div>
        </div>
    </div>
</div>
`;
  }

  static showModal(closeCallback) {
    const modal = document.querySelector('.puzzle-navigation-modal');
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
      const eventTargetIdData = event.target.id.split('.');
      const [level, round] = eventTargetIdData;
      gameData.level = Number(level);
      gameData.page = Number(round);
      const modal = document.querySelector('.puzzle-navigation-modal');
      const modalOverlay = document.querySelector('.modal-backdrop');
      document.body.removeChild(modal);
      document.body.removeChild(modalOverlay);
      const startPage = document.querySelector('.start__page');
      const gameBody = document.querySelector('body');
      startPage.classList.add('display-none');
      gameBody.classList.remove('scroll-not');
      StartNewGame.startGame();
    } else if (event.target.classList.contains('user-words__level')) {
      const level = Number(event.target.getAttribute('level'));
      const userWords = await Repository.getAllUserWords(level - 1, 20);
      const filteredUserWords = userWords.filter((word) => word.textExample.split(' ').length < 11);
      if (filteredUserWords.length < 10) {
        notEnoughWordsMessage.classList.add('not-enough-words_show');
      } else {
        filteredUserWords.length = 10;
        const modal = document.querySelector('.puzzle-navigation-modal');
        const modalOverlay = document.querySelector('.modal-backdrop');
        document.body.removeChild(modal);
        document.body.removeChild(modalOverlay);
        const startPage = document.querySelector('.start__page');
        const gameBody = document.querySelector('body');
        startPage.classList.add('display-none');
        gameBody.classList.remove('scroll-not');
        StartNewGame.startGameWithUserWords(level, filteredUserWords);
      }
    }
  }
}
