class SettingsModal {
  constructor() {
    this.settingsModal = document.querySelector('.settings__modal');
    this.settingsForm = document.querySelector('.settings__form');

    this.settingsBasicInputs = this.settingsForm.querySelectorAll('.setting__info-basic');
    this.settingsBasicInvalidFeedback = this.settingsForm.querySelector('.settings__info-basic-invalid-feedback');
    this.inputsRequired = this.settingsForm.querySelectorAll('input:required');
  }

  markInputsRequiredInvalid() {
    this.inputsRequired.forEach((input) => {
      if (!input.value) {
        input.classList.add('is-invalid');
      }
    });
  }

  unmarkInputsRequiredInvalid() {
    this.inputsRequired.forEach((input) => {
      input.classList.remove('is-invalid');
    });
  }

  markSettingsBasicInvalid() {
    this.settingsBasicInputs.forEach((input) => {
      input.classList.add('is-invalid');
    });
    this.settingsBasicInvalidFeedback.classList.add('d-block');
  }

  unmarkSettingsBasicInvalid() {
    this.settingsBasicInputs.forEach((input) => {
      input.classList.remove('is-invalid');
    });
    this.settingsBasicInvalidFeedback.classList.remove('d-block');
  }

  checkSettingsFormValidity() {
    const inputsBasicArray = Array.prototype.slice.call(this.settingsBasicInputs);
    const inputsRequiredArray = Array.prototype.slice.call(this.inputsRequired);

    const atLeastOneBasicChecked = inputsBasicArray.some((input) => input.checked);
    const atLeastOneRequiredMissed = inputsRequiredArray.some((input) => !input.value);

    if (!atLeastOneBasicChecked) {
      this.markSettingsBasicInvalid();
    }

    if (atLeastOneRequiredMissed) {
      this.markInputsRequiredInvalid();
    }

    return !atLeastOneRequiredMissed && atLeastOneBasicChecked;
  }

  initiate() {
    this.settingsForm.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.unmarkSettingsBasicInvalid();
      this.unmarkInputsRequiredInvalid();
    });
  }
}

export default SettingsModal;
