import sortBy from 'lodash/sortBy';
import keyBy from 'lodash/keyBy';

import Authorization from './Authorization';

import defaultSettings from '../constants/defaultSettings';
import { coefficients, intervals } from '../constants/intervalRepetition';
import backendOrigin from '../constants/app';

import getTodayShort from '../helpers';

class Repository {
  static async getWords(type, group, wordsPerPage) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    let filter;
    if (type === 'new') {
      filter = '{"userWord":null}';
    } else if (type === 'currentSession') {
      const currentSessionEnd = Date.now() + intervals.defaultCurrentSessionFromNow;
      filter = `{"$and":[{"userWord.optional.playNextDate":{"$lt": ${currentSessionEnd}}, "userWord.optional.isDeleted":{"$ne":true}}]}`;
    } else if (type === 'repeat') {
      filter = '{"$and":[{"userWord":{"$ne": null}, "userWord.optional.isDeleted":{"$ne":true}}]}';
    } else if (type === 'deleted') {
      filter = '{"userWord.optional.isDeleted":true}';
    } else if (type === 'hard') {
      filter = '{"userWord.optional.isHard":true}';
    } else if (type === 'allUser') {
      filter = '{"userWord":{"$ne": null}}';
    } else {
      throw new Error(`Type '${type}' is not valid. Use one of: 'new', 'currentSession', 'repeat', 'deleted', 'hard', 'allUser`);
    }

    const url = `${backendOrigin}/users/${userId}/aggregatedWords?${group || Number(group) === 0 ? `group=${group}` : ''}${wordsPerPage ? `&wordsPerPage=${wordsPerPage}` : ''}&filter=${filter}`;

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
    let words = await Repository.getWords('repeat', group, wordsPerPage);
    words = sortBy(words, 'userWord.optional.playNextDate');
    if (words.length > wordsPerPage) {
      words.length = wordsPerPage;
    }
    localStorage.setItem('words', JSON.stringify(keyBy(words, '_id')));
    return words;
  }

  static async getAllUserWordsIncludingHardDeleted(wordsPerPage) {
    const words = await Repository.getWords('allUser', undefined, wordsPerPage);
    localStorage.setItem('words', JSON.stringify(keyBy(words, '_id')));
    return words;
  }

  static async getCurrentSessionUserWords(group, wordsPerPage = 20) {
    let words = await Repository.getWords('currentSession', group, 3600);
    words = sortBy(words, 'userWord.optional.playNextDate');
    if (words.length > wordsPerPage) {
      words.length = wordsPerPage;
    }
    localStorage.setItem('words', JSON.stringify(keyBy(words, '_id')));
    return words;
  }

  static async getNewWords(group, wordsPerPage) {
    const words = await Repository.getWords('new', group, wordsPerPage);
    localStorage.setItem('words', JSON.stringify(keyBy(words, '_id')));
    return words;
  }

  static async getMixedWords(group, wordsPerPage = 20) {
    let words;
    const userWords = await Repository.getCurrentSessionUserWords(group, wordsPerPage);
    if (userWords.length === Number(wordsPerPage)) {
      words = userWords;
    } else {
      const wordsNew = await Repository.getNewWords(group, (wordsPerPage - userWords.length));
      words = [...userWords, ...wordsNew];
    }
    localStorage.setItem('words', JSON.stringify(keyBy(words, '_id')));
    return words;
  }

  static async getMixedWordsWithMandatoryNew(newWordsNumber = 10, group, wordsPerPage = 20) {
    let words;
    const wordsNew = await Repository.getNewWords(group, newWordsNumber);
    if (wordsNew.length >= Number(wordsPerPage)) {
      wordsNew.length = wordsPerPage;
      words = wordsNew;
    } else {
      const userWords = await Repository
        .getCurrentSessionUserWords(group, (wordsPerPage - wordsNew.length));
      words = [...userWords, ...wordsNew];
    }
    localStorage.setItem('words', JSON.stringify(keyBy(words, '_id')));
    return words;
  }

  static async getHardWords(group, wordsPerPage) {
    return Repository.getWords('hard', group, wordsPerPage);
  }

  static async getDeletedWords(group, wordsPerPage) {
    return Repository.getWords('deleted', group, wordsPerPage);
  }

  static async getWordsFromGroupAndPage(group = 0, page = 0) {
    const url = `${backendOrigin}/words?group=${group}&page=${page}`;

    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return rawResponse.json();
  }

  static async getOneUserWord(wordId) {
    const wordsLocalJSON = localStorage.getItem('words');
    if (wordsLocalJSON) {
      const wordsLocal = JSON.parse(wordsLocalJSON);
      if (wordsLocal && wordsLocal[wordId]) {
        return wordsLocal[wordId];
      }
    }

    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const url = `${backendOrigin}/users/${userId}/aggregatedWords/${wordId}`;

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

    const updates = { difficulty, optional: { ...optional, default: 'default' } };

    Repository.updateWordInStorage(wordId, updates);

    const url = `${backendOrigin}/users/${userId}/words/${wordId}`;

    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    return rawResponse.json();
  }

  static updateWordInStorage(wordId, newUserWord) {
    const wordsLocalJSON = localStorage.getItem('words');
    if (!wordsLocalJSON) {
      return;
    }
    const wordsLocal = JSON.parse(wordsLocalJSON);
    if (!wordsLocal[wordId]) {
      return;
    }
    wordsLocal[wordId].userWord = newUserWord;
    localStorage.setItem('words', JSON.stringify(wordsLocal));
  }

  static async updateUserWordDifficulty(wordId, difficulty) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const word = await Repository.getOneUserWord(wordId);
    const updates = { difficulty };
    updates.optional = word.userWord && word.userWord.optional ? word.userWord.optional : { default: 'default' };

    if (!updates.difficulty) {
      updates.difficulty = 'default';
    }

    Repository.updateWordInStorage(wordId, updates);

    const url = `${backendOrigin}/users/${userId}/words/${wordId}`;

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

    let word = await Repository.getOneUserWord(wordId);

    if (!word || !word.userWord) {
      await Repository.createUserWord(wordId);
      word = await Repository.getOneUserWord(wordId);
    }

    const updates = {};
    updates.difficulty = word.userWord && word.userWord.difficulty ? word.userWord.difficulty : 'default';
    if (word.userWord && word.userWord.optional) {
      updates.optional = { ...word.userWord.optional, ...updatedValues };
    } else {
      updates.optional = updatedValues;
    }

    Repository.updateWordInStorage(wordId, updates);

    const url = `${backendOrigin}/users/${userId}/words/${wordId}`;

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

    const url = `${backendOrigin}/users/${userId}/words/${wordId}`;

    await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  }

  // STATISTICS

  static async getStatistics() {
    const statistics = localStorage.getItem('statistics');

    if (statistics) {
      return JSON.parse(statistics);
    }

    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const url = `${backendOrigin}/users/${userId}/statistics`;

    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const statisticsFromDB = await rawResponse.json();

    if (!statistics) {
      localStorage.setItem('statistics', JSON.stringify(statisticsFromDB));
    }

    return statisticsFromDB;
  }

  static async updateOptionalStatistics(updatedValues) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const statistics = await Repository.getStatistics();
    const newStatistics = {
      learnedWords: statistics.learnedWords,
      optional: { ...statistics.optional, ...updatedValues },
    };

    localStorage.setItem('statistics', JSON.stringify(newStatistics));

    const url = `${backendOrigin}/users/${userId}/statistics`;

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

    localStorage.setItem('statistics', JSON.stringify(newStatistics));

    const url = `${backendOrigin}/users/${userId}/statistics`;

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

  // SETTINGS

  static async getSettings() {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const url = `${backendOrigin}/users/${userId}/settings`;

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

    const url = `${backendOrigin}/users/${userId}/settings`;

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

    const url = `${backendOrigin}/users/${userId}/settings`;

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

  // SAVE RESULTS

  static async saveWordResult({ wordId, result = '1', isGame = false }) {
    let isWordNew = false;
    const word = await Repository.getOneUserWord(wordId);

    let toCreate = false;
    if (!word.userWord) {
      toCreate = true;
      word.userWord = {};
      word.userWord.optional = {};
    }

    if (!isGame && !word.userWord.optional.wordLearned) {
      word.userWord.optional.wordLearned = true;
      isWordNew = true;
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

    const promises = [];

    if (toCreate) {
      promises.push(Repository.createUserWord(wordId, 'default', word.userWord.optional));
    } else {
      promises.push(Repository.updateUserWordOptional(wordId, word.userWord.optional));
    }

    if (!isGame) {
      promises.push(Repository.incrementLearnedWords(result, isWordNew));
    }

    const [wordSaved] = await Promise.all(promises);

    return wordSaved;
  }

  static async saveGameResult(gameName, isVictory, sessionData, summary) {
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

    if (!statistics.optional.games[gameName]
      || Array.isArray(statistics.optional.games[gameName])) {
      statistics.optional.games[gameName] = {};
    }

    if (!statistics.optional.games[gameName].resultsList) {
      statistics.optional.games[gameName].resultsList = [];
    }

    if (sessionData) {
      statistics.optional.games[gameName].resultsList.push(sessionData);
    }

    if (summary) {
      statistics.optional.games[gameName].summary = summary;
    }

    return Repository.updateOptionalStatistics(statistics.optional);
  }
}

export default Repository;
