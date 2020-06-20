import jwtDecode from 'jwt-decode';

class Authorization {
  constructor() {
    this.signinForm = document.querySelector('.auth-forms__signin');
    this.signupForm = document.querySelector('.auth-forms__signup');
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

    const token = localStorage.getItem('token');

    if (!this.isTokenExpired()) {
      return token;
    }

    const user = {
      email: localStorage.getItem('email'),
      password: localStorage.getItem('password'),
    };

    return Authorization.signinUser(user);
  }

  static async signupUser(user) {
    const rawResponse = await fetch('https://afternoon-falls-25894.herokuapp.com/users', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const content = await rawResponse.json();

    if (content.error) {
      // eslint-disable-next-line no-alert
      alert(content.error.errors[0].message);
    } else {
      await Authorization.signinUser(user);
    }
  }

  static async signinUser(user) {
    const rawResponse = await fetch('https://afternoon-falls-25894.herokuapp.com/signin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const content = await rawResponse.json();

    if (content.message === 'Authenticated') {
      localStorage.setItem('userId', content.userId);
      localStorage.setItem('token', content.token);
      localStorage.setItem('email', user.email);
      localStorage.setItem('password', user.password);
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

    await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${userId}`, {
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
      await Authorization.signupUser(user);

      this.signupForm.reset();
      if (!window.location.href.endsWith('index.html')) {
        window.location.href = 'index.html';
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
      await Authorization.signinUser(user);

      this.signinForm.reset();
      if (!window.location.href.endsWith('index.html')) {
        window.location.href = 'index.html';
      }
    });
  }
}

export default Authorization;
