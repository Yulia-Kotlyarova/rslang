import sortBy from 'lodash/sortBy';

import Authorization from './Authorization';

import defaultSettings from '../constants/defaultSettings';
import { coefficients, intervals } from '../constants/intervalRepetition';

import getTodayShort from '../helpers';

class Repository {
  static async getWords(type, group, wordsPerPage) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    let filter;
    if (type === 'new') {
      filter = '{"$and":[{"userWord":null, "userWord.optional.isHard":{"$ne":true}, "userWord.optional.isDeleted":{"$ne":true}}]}';
    } else if (type === 'currentSession') {
      const currentSessionEnd = Date.now() + intervals.defaultCurrentSessionFromNow;
      filter = `{"$and":[{"userWord.optional.playNextDate":{"$lt": ${currentSessionEnd}}, "userWord.optional.isHard":{"$ne":true}, "userWord.optional.isDeleted":{"$ne":true}}]}`;
    } else if (type === 'mixed') {
      filter = '{"$and":["userWord":{"$ne": null}, "userWord.optional.isHard":{"$ne":true}, "userWord.optional.isDeleted":{"$ne":true}}]}';
    } else if (type === 'deleted') {
      filter = '{"userWord.optional.isDeleted":true}';
    } else if (type === 'hard') {
      filter = '{"userWord.optional.isHard":true}';
    } else {
      throw new Error(`Type '${type}' is not valid. Use one of: 'new', 'currentSession', 'mixed', 'deleted', 'hard'`);
    }

    const url = `https://afternoon-falls-25894.herokuapp.com/users/${userId}/aggregatedWords?${group || Number(group) === 0 ? `group=${group}` : ''}${wordsPerPage ? `&wordsPerPage=${wordsPerPage}` : ''}&filter=${filter}`;

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

  static async getAllUserWords(group, wordsPerPage) {
    const words = await Repository.getWords('repeat', group, wordsPerPage);
    return sortBy(words, 'userWord.optional.playNextDate');
  }

  static async getCurrentSessionUserWords(group, wordsPerPage) {
    const words = await Repository.getWords('currentSession', group, wordsPerPage);
    return sortBy(words, 'userWord.optional.playNextDate');
  }

  static async getNewWords(group, wordsPerPage) {
    return Repository.getWords('new', group, wordsPerPage);
  }

  static async getMixedWords(group, wordsPerPage = 10) {
    const userWords = await Repository.getCurrentSessionUserWords(group, wordsPerPage);
    if (userWords.length === Number(wordsPerPage)) {
      return userWords;
    }
    const wordsNew = await Repository.getNewWords(group, (wordsPerPage - userWords.length));
    return [...userWords, ...wordsNew];
  }

  static async getHardWords(group, wordsPerPage) {
    return Repository.getWords('hard', group, wordsPerPage);
  }

  static async getDeletedWords(group, wordsPerPage) {
    return Repository.getWords('deleted', group, wordsPerPage);
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

  static async markWordAsDeleted(wordId) {
    return Repository.updateUserWordOptional(wordId, { isDeleted: true });
  }

  static async unmarkWordAsDeleted(wordId) {
    return Repository.updateUserWordOptional(wordId, { isDeleted: false });
  }

  static async markWordAsHard(wordId) {
    return Repository.updateUserWordOptional(wordId, { isHard: true });
  }

  static async unmarkWordAsHard(wordId) {
    return Repository.updateUserWordOptional(wordId, { isHard: false });
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

  static async incrementLearnedWords(result, isWordNew) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();
    const isCorrect = Number(result) !== 0;

    const statistics = await Repository.getStatistics();
    const todayShort = getTodayShort();

    if (!statistics.optional) {
      statistics.optional = {};
    }

    if (!statistics.learnedWords) {
      statistics.learnedWords = 0;
    }
    if (!statistics.optional.dates) {
      statistics.optional.dates = {};
    }
    if (!statistics.optional.dates[todayShort]) {
      statistics.optional.dates[todayShort] = {};
      const todayStatistics = statistics.optional.dates[todayShort];

      if (!isCorrect) {
        todayStatistics.previousGuessed = false;
        todayStatistics.correctSeriesToday = 0;
        todayStatistics.correctMaximumSeriesToday = 0;
        todayStatistics.correctToday = 0;

        todayStatistics.learnedTotalSoFar = statistics.learnedWords;
        todayStatistics.learnedToday = 0;
      } else {
        todayStatistics.previousGuessed = true;
        todayStatistics.correctSeriesToday = 1;
        todayStatistics.correctMaximumSeriesToday = 1;
        todayStatistics.correctToday = 1;

        if (isWordNew) {
          todayStatistics.learnedTotalSoFar = statistics.learnedWords + 1;
          todayStatistics.learnedToday = 1;
        } else {
          todayStatistics.learnedTotalSoFar = statistics.learnedWords;
          todayStatistics.learnedToday = 0;
        }
      }

      todayStatistics.answersGivenToday = 1;
    } else {
      const todayStatistics = statistics.optional.dates[todayShort];

      if (!isCorrect) {
        if (todayStatistics.correctSeriesToday > todayStatistics.correctMaximumSeriesToday) {
          todayStatistics.correctMaximumSeriesToday = todayStatistics.correctSeriesToday;
        }

        todayStatistics.previousGuessed = false;
        todayStatistics.correctSeriesToday = 0;
      } else {
        todayStatistics.previousGuessed = true;
        todayStatistics.correctSeriesToday += 1;
        todayStatistics.correctToday += 1;

        if (todayStatistics.correctSeriesToday > todayStatistics.correctMaximumSeriesToday) {
          todayStatistics.correctMaximumSeriesToday = todayStatistics.correctSeriesToday;
        }

        if (isWordNew) {
          todayStatistics.learnedTotalSoFar += 1;
          todayStatistics.learnedToday += 1;
        }
      }

      todayStatistics.answersGivenToday += 1;
    }

    const newStatistics = {
      learnedWords: isCorrect && isWordNew ? statistics.learnedWords + 1 : statistics.learnedWords,
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
    let isWordNew = false;
    word = await Repository.getOneUserWord(wordId);

    if (!word || !word.userWord) {
      isWordNew = true;
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

    const wordSaved = await Repository.updateUserWordOptional(wordId, word.userWord.optional);
    await Repository.incrementLearnedWords(result, isWordNew);

    return wordSaved;
  }

  static async saveGameResult(gameName, isVictory, sessionData) {
    const statistics = await Repository.getStatistics();
    const todayShort = getTodayShort();

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
