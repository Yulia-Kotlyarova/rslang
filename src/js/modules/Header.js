import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faBook, faChartLine, faDice, faSignOutAlt, faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { faFileWord } from '@fortawesome/free-regular-svg-icons';

import Authorization from './Authorization';

import { renderNewLanguageInElement } from '../helpers';

library.add(faBook);
library.add(faFileWord);
library.add(faChartLine);
library.add(faDice);
library.add(faSignOutAlt);
library.add(faUsers);

library.add(faFileWord);

dom.watch();

export default class Header {
  constructor() {
    this.isSingedUp = false;

    this.iconDictionary = '<i class="fas fa-book fa-2x"></i>';
    this.iconCards = '<i class="far fa-file-word fa-2x"></i>';
    this.iconStatistics = '<i class="fas fa-chart-line fa-2x"></i>';
    this.iconGames = '<i class="fas fa-dice fa-2x"></i>';
    this.iconLogOut = '<i class="fas fa-sign-out-alt fa-2x"></i>';
    this.iconTeam = '<i class="fas fa-users fa-2x"></i>';

    this.userLoginName = '';

    this.mainURL = './index.html';
    this.promoURL = './promo.html';
    this.statisticsURL = './statistics.html';
    this.dictionaryURL = './dictionary.html';
    this.teamURL = './team.html';

    this.allGamesURL = './games.html';
    this.gameSavannaURL = './savannah.html';
    this.gameAudioCallURL = './audioCall.html';
    this.gameSprintURL = './sprint.html';
    this.gameSpeakItURL = './speakIt.html';
    this.gamePuzzleURL = './puzzle.html';
    this.gameScrambleURL = './scramble.html';
    this.authorizationURL = './authorization.html';
  }

  run() {
    this.checkUserAuthorization();
    this.renderHeader();
    Header.setEventListeners();

    let language = localStorage.getItem('app-language');
    if (!language) {
      language = 'en';
      localStorage.setItem('app-language', 'en');
    }

    if (language !== 'en') {
      Header.renderLanguage(language);
    }

    document.body.classList.remove('hidden-for-header-render');
  }

  checkUserAuthorization() {
    if (Authorization.isSignedUp()) {
      this.isSingedUp = true;
      this.userLoginName = localStorage.getItem('email');
    }
  }

  static setEventListeners() {
    const authorizationButton = document.querySelector('.button_authorization');
    authorizationButton.addEventListener('click', () => Header.signOfUser());

    const languageButton = document.querySelector('.button_language');
    languageButton.addEventListener('click', this.changeLanguage);
  }

  static signOfUser() {
    Authorization.logOut();
  }

  static changeLanguage() {
    const currentLanguage = localStorage.getItem('app-language');

    let newLanguage;
    if (currentLanguage === 'en') {
      newLanguage = 'ru';
    } else if (currentLanguage === 'ru') {
      newLanguage = 'en';
    }

    localStorage.setItem('app-language', newLanguage);

    Header.renderLanguage(newLanguage);
  }

  static renderLanguage(language) {
    const languageButton = document.querySelector('.button_language');
    languageButton.innerText = language.toUpperCase();

    renderNewLanguageInElement(document, language);
  }

  renderHeader() {
    const header = document.createElement('header');
    header.classList.add('app-header', 'sticky-top');
    document.body.prepend(header);

    const headerBurger = `<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span></button>`;

    const logo = `<div class="header__promo">
     <div class="header__logo"><div>RS LANG</div></div>
     </div>`;

    const cardsButton = `<a href=${this.mainURL} title="Learn words" data-en="Learn words" data-ru="Изучать слова"><button class="header__button button_cards">${this.iconCards}</button></a>`;
    const gamesButton = `<div class="header__dropdown">
    <a href=${this.allGamesURL} title="All games" title="All games" data-en="All games" data-ru="Все игры"><button class="header__button button_games">${this.iconGames}</button></a>
    <div class="dropdown-content">
      <a href=${this.gameSpeakItURL}>Speak It</a>
      <a href=${this.gamePuzzleURL}>English Puzzle</a>
      <a href=${this.gameSavannaURL}>Savanna</a>
      <a href=${this.gameSprintURL}>Sprint</a>
      <a href=${this.gameAudioCallURL}>AudioCall</a>
      <a href=${this.gameScrambleURL}>Scramble</a>
    </div>
    </div>`;

    const dictionaryButton = `<div class="header__dropdown">
    <a href=${this.dictionaryURL}><button class="header__button button_dictionary" title="Dictionary" data-en="Dictionary" data-ru="Словарь">${this.iconDictionary}</button></a>
    <div class="dropdown-content">
        <a href="dictionary.html#words-user" data-en="Words in progress" data-ru="Изучаемые слова">Words in progress</a>
        <a href="dictionary.html#words-hard" data-en="Hard words" data-ru="Трудные слова">Hard words</a>
        <a href="dictionary.html#words-deleted" data-en="Deleted words" data-ru="Удаленные слова">Deleted words</a>
    </div>
    </div>`;
    const statisticsButton = `<a href=${this.statisticsURL}><button class="header__button button_statistics" title="Statistics" data-en="Statistics" data-ru="Статистика">${this.iconStatistics}</button></a>`;
    const teamButton = `<a href=${this.teamURL}><button class="header__button button_team" title="Team" data-en="Team" data-ru="Команда">${this.iconTeam}</button></a>`;
    const promoButton = `<a href=${this.promoURL}><button class="header__button button_promo" title="Promo" data-en="Promo" data-ru="Промо" data-change-text="false">P</button></a>`;
    const languageButton = '<button class="header__button button_language" title="Change language" data-en="Change language" data-ru="Изменить язык" data-change-text="false">EN</button>';
    const logOutButtonMain = '<button class="header__button button_authorization" data-en="LOG OUT" data-ru="ВЫЙТИ">LOG OUT</button>';
    const logInButtonMain = '<button class="header__button button_authorization" data-en="LOG IN" data-ru="ВОЙТИ">LOG IN</button>';
    const userLoginName = `<div class="header__username"><span>${this.userLoginName}</span></div>`;

    let userAutherizationArea;
    if (this.isSingedUp) {
      userAutherizationArea = ` <div class="header__user-authorization">${userLoginName}${logOutButtonMain}</div>`;
    } else {
      userAutherizationArea = ` <div class="header__user-authorization">${logInButtonMain}</div>`;
    }

    const buttonsGroup = `<div class="header__buttons">
        ${cardsButton}
        ${gamesButton}
        ${dictionaryButton}
        ${statisticsButton}
        ${teamButton}
        ${promoButton}
        ${languageButton}
        </div>`;

    const headerContainer = `<nav class="navbar navbar-expand-lg navbar-light bg-light app-header__container">
        ${headerBurger}
        ${logo}
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <div class="navbar-nav" id="navbar-nav-margin">
            ${buttonsGroup}
            ${userAutherizationArea}
            </div>
          </div>
        </nav>`;

    const headerHTML = `${headerContainer}`;
    header.innerHTML = headerHTML;
  }
}
