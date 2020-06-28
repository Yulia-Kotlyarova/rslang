import Authorization from './Authorization';

export default class Header {
  constructor() {
    this.isSingedUp = false;

    this.iconDictionary = '<i class="fas fa-book fa-2x"></i>';
    this.iconCards = '<i class="far fa-file-word fa-2x"></i>';
    this.iconStatistics = '<i class="fas fa-chart-line fa-2x"></i>';
    this.iconSettings = '<i class="fas fa-cog fa-2x"></i>';
    this.iconGames = '<i class="fas fa-dice fa-2x"></i>';
    this.iconSettings = '<i class="fas fa-cog fa-2x"></i>';
    this.iconLogOut = '<i class="fas fa-sign-out-alt fa-2x"></i>';
    this.iconTeam = '<i class="fas fa-users-cog fa-2x"></i>';

    this.userLoginName = '';

    this.mainURL = './index.html';
    this.promoURL = './promo.html';
    this.statisticsURL = './statistics.html';
    this.settingsURL = './settings.html'; // надо добавить страницу
    this.dictionaryURL = './dictionary.html';
    this.teamURL = './team.html';

    this.allGamesURL = './games.html'; // добавим страницу, если время останется
    this.gameSavannaURL = './savannah.html';
    this.gameAudioCallURL = './audioCall.html';
    this.gameSprintURL = './sprint.html';
    this.gameSpeakItURL = './speakIt.html';
    this.gamePuzzleURL = './puzzle.html';
    this.authorizationURL = './authorization.html';
  }

  run() {
    this.checkUserAuthorization();
    this.renderHeader();
    Header.setEventListeners();
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
  }

  static signOfUser() {
    Authorization.logOut();
  }

  renderHeader() {
    const header = document.createElement('header');
    header.classList.add('app-header', 'sticky-top');
    document.body.prepend(header);

    const headerBurger = `<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span></button>`;

    const promoButton = `<div class="header__promo">
     <a href=${this.promoURL}><div class="header__logo"><div>RS LANG</div></div></a>
     </div>`;

    const cardsButton = `<a href=${this.mainURL}><button class="header__button button_cards">${this.iconCards}</button></a>`;
    const gamesButton = `<div class="header__dropdown">
    <a href="#games"><button class="header__button button_games">${this.iconGames}</button></a>
    <div class="dropdown-content">
      <a href=${this.gameSpeakItURL}>Speak It</a>
      <a href=${this.gamePuzzleURL}>English Puzzle</a>
      <a href=${this.gameSavannaURL}>Savanna</a>
      <a href=${this.gameSprintURL}>Sprint</a>
      <a href=${this.gameAudioCallURL}>AudioCall</a>
    </div>
    </div>`;

    const dictionaryButton = `<div class="header__dropdown">
    <a href=${this.dictionaryURL}><button class="header__button button_dictionary">${this.iconDictionary}</button></a>
    <div class="dropdown-content">
        <a href="#">Все слова</a>
        <a href="#">Трудные слова</a>
        <a href="#">Удаленные слова</a>
    </div>
    </div>`;
    const statisticsButton = `<a href=${this.statisticsURL}><button class="header__button button_statistics">${this.iconStatistics}</button></a>`;
    const settingsButton = `<a href=${this.settingsURL}><button class="header__button button_settings">${this.iconSettings}</button></a>`;
    const teamButton = `<a href=${this.teamURL}><button class="header__button button_team">${this.iconTeam}</button></a>`;
    const logOutButtonMain = '<button class="header__button button_authorization">LOG OUT</button>';
    const logInButtonMain = '<button class="header__button button_authorization">LOG IN</button>';
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
        ${settingsButton}
        ${teamButton}
        </div>`;

    const headerContainer = `<nav class="navbar navbar-expand-lg navbar-light bg-light app-header__container">
        ${headerBurger}
        ${promoButton}
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