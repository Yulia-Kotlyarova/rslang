import sortBy from 'lodash/sortBy';

import Authorization from './Authorization';

import defaultSettings from '../constants/defaultSettings';
import { coefficients, intervals } from '../constants/intervalRepetition';

class Repository {
  static async getWords(type, wordsPerPage) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    let filter;
    if (type === 'new') {
      filter = '{"userWord":null}';
    } else if (type === 'currentSession') {
      const currentSessionEnd = Date.now() + intervals.defaultCurrentSessionFromNow;
      filter = `{"userWord.optional.playNextDate":{"$lt": ${currentSessionEnd}}}`;
    } else {
      filter = '{"userWord":{"$ne": null}}';
    }

    // На 01.07.2020 бэкенд не фильтрует слова по группе, но возвращает пустой массив,
    // если не передавать значение этого параметра => рандомный номер
    const group = 777;

    const url = `https://afternoon-falls-25894.herokuapp.com/users/${userId}/aggregatedWords?${group ? `group=${group}` : ''}${wordsPerPage ? `&wordsPerPage=${wordsPerPage}` : ''}&filter=${filter}`;

    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const content = await rawResponse.json();

    return content[0].paginatedResults;
  }

  static async getAllUserWords(wordsPerPage = '') {
    const words = await Repository.getWords('repeat', wordsPerPage);
    return sortBy(words, 'userWord.optional.playNextDate');
  }

  static async getCurrentSessionUserWords(wordsPerPage = '') {
    const words = await Repository.getWords('currentSession', wordsPerPage);
    return sortBy(words, 'userWord.optional.playNextDate');
  }

  static async getNewWords(wordsPerPage) {
    return Repository.getWords('new', wordsPerPage);
  }

  static async getMixedWords(wordsPerPage) {
    const userWords = await Repository.getCurrentSessionUserWords(wordsPerPage);
    if (userWords.length === Number(wordsPerPage)) {
      return userWords;
    }
    const wordsNew = await Repository.getNewWords((wordsPerPage - userWords.length));
    return [...userWords, ...wordsNew];
  }

  static async getOneUserWord(wordId) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const url = `https://afternoon-falls-25894.herokuapp.com/users/${userId}/aggregatedWords/${wordId}`;

    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const content = await rawResponse.json();

    return content[0];
  }

  static async createUserWord(wordId, difficulty = 'default', optional = {}) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const url = `https://afternoon-falls-25894.herokuapp.com/users/${userId}/words/${wordId}`;

    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ difficulty, optional: { ...optional, default: 'default' } }),
    });

    return rawResponse.json();
  }

  static async updateUserWordDifficulty(wordId, difficulty) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const word = await Repository.getOneUserWord(wordId);
    const updates = { difficulty };
    updates.optional = word.userWord && word.userWord.optional ? word.userWord.optional : { default: 'default' };

    const url = `https://afternoon-falls-25894.herokuapp.com/users/${userId}/words/${wordId}`;

    if (!updates.difficulty) {
      updates.difficulty = 'default';
    }

    const rawResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    return rawResponse.json();
  }

  static async updateUserWordOptional(wordId, updatedValues) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const word = await Repository.getOneUserWord(wordId);

    const updates = {};
    updates.difficulty = word.userWord && word.userWord.difficulty ? word.userWord.difficulty : 'default';
    if (word.userWord && word.userWord.optional) {
      updates.optional = { ...word.userWord.optional, ...updatedValues };
    } else {
      updates.optional = updatedValues;
    }

    const url = `https://afternoon-falls-25894.herokuapp.com/users/${userId}/words/${wordId}`;

    const rawResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    return rawResponse.json();
  }

  static async deleteUserWord(wordId) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const url = `https://afternoon-falls-25894.herokuapp.com/users/${userId}/words/${wordId}`;

    await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  static async getStatistics() {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const url = `https://afternoon-falls-25894.herokuapp.com/users/${userId}/statistics`;

    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (rawResponse.status.toString() === '404') {
      return {
        learnedWords: 0,
        optional: {},
      };
    }

    return rawResponse.json();
  }

  static async updateOptionalStatistics(updatedValues) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const statistics = await Repository.getStatistics();
    const newStatistics = {
      learnedWords: statistics.learnedWords,
      optional: { ...statistics.optional, ...updatedValues },
    };

    const url = `https://afternoon-falls-25894.herokuapp.com/users/${userId}/statistics`;

    const rawResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStatistics),
    });

    return rawResponse.json();
  }

  static getTodayShort() {
    const now = new Date();
    const year = now.getFullYear();
    let month = now.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let date = now.getDate();
    if (date < 10) {
      date = `0${date}`;
    }
    return `${year}-${month}-${date}`;
  }

  static async incrementLearnedWords() {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const statistics = await Repository.getStatistics();
    const todayShort = Repository.getTodayShort();

    if (!statistics.optional) {
      statistics.optional = {};
    }
    if (!statistics.optional.dates) {
      statistics.optional.dates = {};
    }
    if (!statistics.optional.dates[todayShort]) {
      statistics.optional.dates[todayShort] = {
        learnedTotalSoFar: statistics.learnedWords + 1,
        learnedToday: 1,
      };
    } else {
      statistics.optional.dates[todayShort].learnedTotalSoFar = statistics.learnedWords + 1;
      statistics.optional.dates[todayShort].learnedToday += 1;
    }

    const newStatistics = {
      learnedWords: statistics.learnedWords + 1,
      optional: statistics.optional,
    };

    const url = `https://afternoon-falls-25894.herokuapp.com/users/${userId}/statistics`;

    const rawResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStatistics),
    });

    return rawResponse.json();
  }

  static async getSettings() {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const url = `https://afternoon-falls-25894.herokuapp.com/users/${userId}/settings`;

    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (rawResponse.status.toString() === '404') {
      const { wordsPerDay } = defaultSettings;
      delete defaultSettings.wordsPerDay;

      return {
        wordsPerDay,
        optional: defaultSettings,
      };
    }

    return rawResponse.json();
  }

  static async updateOptionalSettings(updatedValues) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const settings = await Repository.getSettings();
    const newSettings = {
      wordsPerDay: settings.wordsPerDay,
      optional: { ...settings.optional, ...updatedValues },
    };

    const url = `https://afternoon-falls-25894.herokuapp.com/users/${userId}/settings`;

    const rawResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSettings),
    });

    return rawResponse.json();
  }

  static async updateWordsPerDay(wordsPerDay) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const settings = await Repository.getSettings();
    const newSettings = {
      wordsPerDay,
      optional: settings.optional,
    };

    const url = `https://afternoon-falls-25894.herokuapp.com/users/${userId}/statistics`;

    const rawResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSettings),
    });

    return rawResponse.json();
  }

  static async saveWordResult({ wordId, result = '1' }) {
    let word;
    word = await Repository.getOneUserWord(wordId);

    if (!word) {
      await Repository.createUserWord(wordId);
      word = await Repository.getOneUserWord(wordId);
    }

    let interval;

    if (result === '0') {
      interval = intervals.defaultAgainInterval;
      word.userWord.optional.lastPlayedDate = Date.now();
      word.userWord.optional.playNextDate = Date.now() + interval;
    } else {
      const { lastPlayedDate } = word.userWord.optional;

      if (lastPlayedDate) {
        interval = Date.now() - lastPlayedDate;
      } else {
        interval = intervals.defaultInterval;
      }

      if (interval < intervals.defaultInterval) {
        interval = intervals.defaultInterval;
      }

      word.userWord.optional.lastPlayedDate = Date.now();
      word.userWord.optional.playNextDate = Date.now() + (interval * coefficients[result]);
    }

    await Repository.updateUserWordOptional(wordId, word.userWord.optional);
    await Repository.incrementLearnedWords();
  }

  static async saveGameResult(gameName, isVictory, sessionData) {
    const statistics = await Repository.getStatistics();
    const todayShort = Repository.getTodayShort();

    if (!statistics.optional) {
      statistics.optional = {};
    }
    if (!statistics.optional.dates) {
      statistics.optional.dates = {};
    }

    if (!statistics.optional.dates[todayShort]) {
      statistics.optional.dates[todayShort] = {
        gamesPlayed: 1,
      };

      if (isVictory) {
        statistics.optional.dates[todayShort].victories = 1;
      } else {
        statistics.optional.dates[todayShort].defeats = 1;
      }
    } else {
      statistics.optional.dates[todayShort]
        .gamesPlayed = statistics.optional.dates[todayShort].gamesPlayed
          ? statistics.optional.dates[todayShort].gamesPlayed + 1
          : 1;

      if (isVictory) {
        statistics.optional.dates[todayShort]
          .victories = statistics.optional.dates[todayShort].victories
            ? statistics.optional.dates[todayShort].victories + 1
            : 1;
      } else {
        statistics.optional.dates[todayShort]
          .defeats = statistics.optional.dates[todayShort].defeats
            ? statistics.optional.dates[todayShort].defeats + 1
            : 1;
      }
    }

    if (!statistics.optional.games) {
      statistics.optional.games = {
        [gameName]: [],
      };
    }

    if (!statistics.optional.games[gameName]) {
      statistics.optional.games[gameName] = [];
    }

    statistics.optional.games[gameName].push(sessionData);

    return Repository.updateOptionalStatistics(statistics.optional);
  }
}

export default Repository;
