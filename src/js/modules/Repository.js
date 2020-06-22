import Authorization from './Authorization';

class Repository {
  static async getAllUserWords(group = '', wordsPerPage = '') {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const filter = '{"userWord": {"$exists": "true"}}';

    const url = `https://afternoon-falls-25894.herokuapp.com/users/${userId}/aggregatedWords?${group ? `group=${group}` : ''}${wordsPerPage ? `wordsPerPage=${wordsPerPage}` : ''}filter=${filter}`;

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

  static async createUserWord(wordId, difficulty, optional = {}) {
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
      body: JSON.stringify({ difficulty, optional }),
    });

    return rawResponse.json();
  }

  static async updateUserWordDifficulty(wordId, difficulty) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const word = await Repository.getOneUserWord(wordId);
    const updates = { difficulty };
    updates.optional = word.userWord && word.userWord.optional ? word.userWord.optional : {};

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

  static async updateUserWordOptional(wordId, updatedValues) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const word = await Repository.getOneUserWord(wordId);

    const updates = {};
    updates.difficulty = word.userWord && word.userWord.difficulty ? word.userWord.difficulty : '';
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

  static async incrementLearnedWords() {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const statistics = await Repository.getStatistics();
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
      return {
        wordsPerDay: 50, // todo: do we have default values and where do we store them
        optional: {},
      };
    }

    return rawResponse.json();
  }

  static async updateOptionalSettings(updatedValues) {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    const settings = await Repository.getSettings();
    const newSettings = {
      learnedWords: settings.wordsPerDay,
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
}

export default Repository;
