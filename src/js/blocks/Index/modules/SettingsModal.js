import $ from 'jquery';

import Repository from '../../../modules/Repository';

class SettingsModal {
  constructor() {
    this.settingsModal = document.querySelector('.settings__modal');
    this.settingsForm = document.querySelector('.settings__form');

    this.settingsBasicInputs = this.settingsForm.querySelectorAll('.setting__info-basic');
    this.settingsBasicInvalidFeedback = this.settingsForm.querySelector('.settings__info-basic-invalid-feedback');
    this.inputsRequired = this.settingsForm.querySelectorAll('input:required');

    this.inputsCheckboxes = this.settingsForm.querySelectorAll('input[type=checkbox]');
    this.inputsRadios = this.settingsForm.querySelectorAll('input[type=radio]');
    this.inputsNumbers = this.settingsForm.querySelectorAll('input[type=number]');
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

  async prefillForm() {
    const settingsRaw = await Repository.getSettings();
    const settings = { wordsPerDay: settingsRaw.wordsPerDay, ...settingsRaw.optional };

    this.inputsCheckboxes.forEach((checkbox) => {
      const element = checkbox;
      element.checked = settings[checkbox.id];
    });

    this.inputsNumbers.forEach((inputNumber) => {
      const element = inputNumber;
      element.value = Number(settings[inputNumber.id]);
    });

    this.inputsRadios.forEach((radio) => {
      const element = radio;
      element.checked = settings[radio.name] === radio.value;
    });

    return settings;
  }

  async initiate() {
    const settings = await this.prefillForm();
    localStorage.setItem('settings', JSON.stringify(settings));

    this.settingsForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.unmarkSettingsBasicInvalid();
      this.unmarkInputsRequiredInvalid();

      if (this.checkSettingsFormValidity()) {
        const formData = new FormData(this.settingsForm);
        const newSettings = Object.fromEntries(formData.entries());

        this.inputsCheckboxes.forEach((checkbox) => {
          newSettings[checkbox.id] = newSettings[checkbox.id] === 'on';
        });

        localStorage.setItem('settings', JSON.stringify(newSettings));

        const { wordsPerDay } = newSettings;
        delete newSettings.wordsPerDay;

        $(this.settingsModal).modal('hide');

        await Repository.updateWordsPerDay(wordsPerDay);
        await Repository.updateOptionalSettings(newSettings);
      }
    });
  }
}

export default SettingsModal;
