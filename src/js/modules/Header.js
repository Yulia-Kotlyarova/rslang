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
    this.promoURL = './promo.html'; // надо добавить страницу
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
  }

  checkUserAuthorization() {
    if (Authorization.isSignedUp()) {
      this.isSingedUp = true;
      this.userLoginName = localStorage.getItem('email');
    }
  }

  static setEventListeners() {
    const authorizationButtonMain = document.querySelector('.button_authorization_main');
    const authorizationButtonBurger = document.querySelector('.button_authorization_burger');
    const headerBurger = document.querySelector('.header__burger');
    authorizationButtonMain.addEventListener('click', () => Header.signOfUser());
    authorizationButtonBurger.addEventListener('click', () => Header.signOfUser());
    headerBurger.addEventListener('click', () => Header.burgerMenuOpenClose(headerBurger));
  }

  static signOfUser() {
    Authorization.logOut();
  }

  static burgerMenuOpenClose(headerBurger) {
    const burgerMenu = document.querySelector('.header__burger__menu');
    const isOpen = headerBurger.classList.contains('header__burger_rotate');
    if (isOpen) {
      headerBurger.classList.remove('header__burger_rotate');
      burgerMenu.classList.add('burger__menu_hide');
      burgerMenu.classList.remove('burger__menu_show');
    } else {
      headerBurger.classList.add('header__burger_rotate');
      burgerMenu.classList.add('burger__menu_show');
      burgerMenu.classList.remove('burger__menu_hide');
    }
  }

  renderHeader() {
    const header = document.createElement('header');
    header.classList.add('app-header', 'sticky-top');
    document.body.prepend(header);

    const headerBurger = `<div class="header__burger">
     <div class="burder__line"></div>
     <div class="burder__line"></div>
     <div class="burder__line"></div>
     </div>`;

    const promoButton = `<div class="header__promo">
     <a href=${this.promoURL}><div class="header__logo"><div>RS LANG</div></div></a>
     </div>`;

    const cardsButton = `<a href=${this.mainURL}><button class="header__button button_cards">${this.iconCards}</button></a>`;
    const gamesButton = `<div class="dropdown">
    <a href="#games"><button class="header__button button_games">${this.iconGames}</button></a>
    <div class="dropdown-content">
      <a href=${this.gameSpeakItURL}>Speak It</a>
      <a href=${this.gamePuzzleURL}>English Puzzle</a>
      <a href=${this.gameSavannaURL}>Savanna</a>
      <a href=${this.gameSprintURL}>Sprint</a>
      <a href=${this.gameAudioCallURL}>AudioCall</a>
    </div>
    </div>`;

    const dictionaryButton = `<div class="dropdown">
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
    const logOutButtonBurgerMenu = `<button class="header__button button_authorization button_authorization_burger">${this.iconLogOut}</button>`;
    const logInButtonBurgerMenu = '<button class="header__button button_authorization button_authorization_burger">Log In</button>';
    const logOutButtonMain = '<button class="header__button button_authorization_main">LOG OUT</button>';
    const logInButtonMain = '<button class="header__button button_authorization_main">LOG IN</button>';
    const userLoginName = `<div class="header__username"><span>${this.userLoginName}</span></div>`;

    let userAutherizationArea;
    if (this.isSingedUp) {
      userAutherizationArea = ` <div class="header__user-authorization">${userLoginName}${logOutButtonMain}</div>`;
    } else {
      userAutherizationArea = ` <div class="header__user-authorization">${logInButtonMain}</div>`;
    }

    const buttonsGroup = `<div class="header__buttons">${cardsButton}${gamesButton}
          ${dictionaryButton}${statisticsButton}${settingsButton}${teamButton}</div>`;

    const burgerAuthorizationBtn = this.isSingedUp ? logOutButtonBurgerMenu : logInButtonBurgerMenu;

    const headerBurgerMenu = `<div class="header__burger__menu burger__menu_hide">
        ${userLoginName}
        ${cardsButton}
        ${gamesButton}
        ${dictionaryButton}
        ${statisticsButton}
        ${settingsButton}
        ${teamButton}
        ${burgerAuthorizationBtn}
        </div>`;

    const headerContainer = `<div class="app-header__container">${headerBurger}${promoButton}
          ${buttonsGroup}${userAutherizationArea}</div>`;

    const headerHTML = `${headerBurgerMenu}${headerContainer}`;
    header.innerHTML = headerHTML;
  }
}
