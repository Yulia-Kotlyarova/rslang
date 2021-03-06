import jwtDecode from 'jwt-decode';

import MessageModal from './MessageModal';

import defaultSettings from '../constants/defaultSettings';
import backendOrigin from '../constants/app';

import { renderNewLanguageInElement } from '../helpers';

class Authorization {
  constructor() {
    this.formContainer = document.querySelector('.auth-forms');

    this.signinForm = this.formContainer.querySelector('.auth-forms__signin');
    this.signupForm = this.formContainer.querySelector('.auth-forms__signup');

    this.languageButtons = this.formContainer.querySelectorAll('.auth-forms__language-button');
  }

  static getUserDataFromForm(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    return { email, password };
  }

  static isTokenExpired() {
    const token = localStorage.getItem('token');

    if (!token) {
      return true;
    }

    const { exp } = jwtDecode(token);

    const now = new Date();
    const tokenExpirationDate = new Date(exp * 1000);

    return now > tokenExpirationDate;
  }

  static isSignedUp() {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    return !!(email && password);
  }

  static async getFreshToken() {
    if (!this.isSignedUp()) {
      throw new Error('The user is not signed up. Can not refresh token.');
    }

    if (!this.isTokenExpired()) {
      return localStorage.getItem('token');
    }

    const user = {
      email: localStorage.getItem('email'),
      password: localStorage.getItem('password'),
    };

    return Authorization.signinUser(user);
  }

  static async signupUser(user) {
    const rawResponse = await fetch(`${backendOrigin}/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const contentType = rawResponse.headers.get('content-type');
    let contentText;
    let content;

    if (contentType.startsWith('text')) {
      contentText = await rawResponse.text();
    } else if (contentType.startsWith('application/json')) {
      content = await rawResponse.json();
    }

    if (!rawResponse.ok && rawResponse.status !== 422) {
      throw new Error(`${rawResponse.statusText}. ${contentText || ''}`);
    }

    if (!content) {
      throw new Error('Can not sign up.');
    }

    if (content.error) {
      throw new Error(content.error.errors[0].message);
    }

    localStorage.setItem('settings', JSON.stringify(defaultSettings));

    const token = await Authorization.signinUser(user);

    const userId = localStorage.getItem('userId');

    const settings = {
      wordsPerDay: defaultSettings.wordsPerDay,
    };
    delete defaultSettings.wordsPerDay;
    settings.optional = defaultSettings;

    await fetch(`${backendOrigin}/users/${userId}/settings`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    const defaultStatistics = {
      learnedWords: 0,
      optional: { default: 'default' },
    };

    await fetch(`${backendOrigin}/users/${userId}/statistics`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(defaultStatistics),
    });
  }

  static async signinUser(user) {
    const rawResponse = await fetch(`${backendOrigin}/signin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (rawResponse.status === 404) {
      throw new Error('User with specified email and password not found');
    }

    if (!rawResponse.ok) {
      throw new Error(rawResponse.statusText);
    }

    const content = await rawResponse.json();

    if (content.message !== 'Authenticated') {
      throw new Error('Can not authenticate.');
    }

    localStorage.setItem('userId', content.userId);
    localStorage.setItem('token', content.token);
    localStorage.setItem('email', user.email);
    localStorage.setItem('password', user.password);

    if (!localStorage.getItem('settings')) {
      const settingsRawResponse = await fetch(`${backendOrigin}/users/${content.userId}/settings`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${content.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const settings = await settingsRawResponse.json();

      const settingsToSave = {
        wordsPerDay: settings.wordsPerDay,
        ...settings.optional,
      };

      localStorage.setItem('settings', JSON.stringify(settingsToSave));
    }

    return content.token;
  }

  static logOut() {
    localStorage.clear();
    if (!window.location.href.endsWith('authorization.html')) {
      window.location.href = 'authorization.html';
    }
  }

  static async deleteUser() {
    const userId = localStorage.getItem('userId');
    const token = await Authorization.getFreshToken();

    await fetch(`${backendOrigin}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    this.logOut();
  }

  setEventListeners() {
    this.signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.signupForm.classList.add('was-validated');

      if (!this.signupForm.checkValidity()) {
        return;
      }

      const user = Authorization.getUserDataFromForm(this.signupForm);
      try {
        await Authorization.signupUser(user);
      } catch (e) {
        MessageModal.showModal(e.message);
        return;
      }

      if (!window.location.href.endsWith('index.html')) {
        const hasBeenHereBefore = localStorage.getItem('hasBeenHereBefore');
        if (hasBeenHereBefore) {
          window.location.href = 'index.html';
        } else {
          localStorage.setItem('hasBeenHereBefore', 'true');
          window.location.href = 'promo.html';
        }
      }
    });

    this.signinForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.signinForm.classList.add('was-validated');

      if (!this.signinForm.checkValidity()) {
        return;
      }

      const user = Authorization.getUserDataFromForm(this.signinForm);
      try {
        await Authorization.signinUser(user);
      } catch (e) {
        MessageModal.showModal(e.message);
        return;
      }

      if (!window.location.href.endsWith('index.html')) {
        const hasBeenHereBefore = localStorage.getItem('hasBeenHereBefore');
        if (hasBeenHereBefore) {
          window.location.href = 'index.html';
        } else {
          localStorage.setItem('hasBeenHereBefore', 'true');
          window.location.href = 'promo.html';
        }
      }
    });

    this.formContainer.addEventListener('click', (event) => {
      const languageButton = event.target.closest('.auth-forms__language-button');

      if (!languageButton) {
        return;
      }

      const currentLanguage = localStorage.getItem('app-language');

      let newLanguage;
      if (currentLanguage === 'en') {
        newLanguage = 'ru';
      } else if (currentLanguage === 'ru') {
        newLanguage = 'en';
      }

      localStorage.setItem('app-language', newLanguage);
      this.languageButtons.forEach((button) => {
        const buttonElement = button;
        buttonElement.innerText = newLanguage;
      });
      renderNewLanguageInElement(this.formContainer, newLanguage);
    });
  }
}

export default Authorization;
