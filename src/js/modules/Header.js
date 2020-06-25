export default class Header {
  constructor() {
    this.iconDictionary = '<i class="fas fa-book fa-2x"></i>';
    this.iconCards = '<i class="far fa-file-word fa-2x"></i>';
    this.iconStatistics = '<i class="fas fa-chart-line fa-2x"></i>';
    this.iconSettings = '<i class="fas fa-cog fa-2x"></i>';
    this.iconGames = '<i class="fas fa-dice fa-2x"></i>';
    this.iconSettings = '<i class="fas fa-cog fa-2x"></i>';
    this.iconLogOut = '<i class="fas fa-sign-out-alt fa-2x"></i>';
    this.iconTeam = '<i class="fas fa-users-cog fa-2x"></i>';

    this.userLogin = 'UserLogin@test.test';

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
    const logOutButtonBurgerMenu = `<button class="header__button button_logout button_logout_burger">${this.iconLogOut}</button>`;
    const logOutButtonMain = '<button class="header__button button_logout_main">LOG OUT</button>';
    const userLogin = `<div class="header__username"><span>${this.userLogin}</span></div>`;

    const userAutherizationArea = ` <div class="header__user-authorization">${userLogin}${logOutButtonMain}</div>`;
    const buttonsGroup = `<div class="header__buttons">${cardsButton}${gamesButton}
          ${dictionaryButton}${statisticsButton}${settingsButton}${teamButton}</div>`;

    const headerBurgerMenu = `<div class="header__burger__menu">
        ${userLogin}${cardsButton}
        ${gamesButton}
        ${dictionaryButton}
        ${statisticsButton}
        ${settingsButton}
        ${teamButton}
        ${logOutButtonBurgerMenu}
        </div>`;

    const headerContainer = `<div class="app-header__container">${headerBurger}${promoButton}
          ${buttonsGroup}${userAutherizationArea}</div>`;

    const headerHTML = `${headerBurgerMenu}${headerContainer}`;
    header.innerHTML = headerHTML;
  }

  setEventListenetrs() {
    const logOutButtonMain = document.querySelector('.button_logout_main');
    logOutButtonMain.addEventListener('click', () => this.signOfUser());
  }
}
