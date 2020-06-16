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

  async signupUser(user) {
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
      await this.signinUser(user);
    }
  }

  async signinUser(user) {
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

      this.signupForm.reset();
      this.signinForm.reset();

      window.location.href = 'index.html';
    }
  }

  setEventListeners() {
    this.signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const user = Authorization.getUserDataFromForm(this.signupForm);
      await this.signupUser(user);
    });

    this.signinForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const user = Authorization.getUserDataFromForm(this.signinForm);
      await this.signinUser(user);
    });
  }
}

export default Authorization;
