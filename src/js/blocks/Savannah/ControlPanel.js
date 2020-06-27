import { soundOn, soundOff } from './consts';
import { savannahSettings } from './appState';

export default class ControlPanel {
  constructor() {
    this.controlSoundContainer = document.querySelector('.control__sound');
    this.closeButton = document.querySelector('.control__close');
  }

  setEventListeners() {
    this.closeButton.addEventListener('click', () => this.closeGame());
    this.controlSoundContainer.addEventListener('click', () => this.switchSoundMode());
  }

  setSoundMode() {
    if (savannahSettings.soundOn) {
      savannahSettings.soundOn = true;
      this.controlSoundContainer.innerHTML = soundOn;
    } else {
      savannahSettings.soundOn = false;
      this.controlSoundContainer.innerHTML = soundOff;
    }
  }

  switchSoundMode() {
    if (savannahSettings.soundOn) {
      savannahSettings.soundOn = false;
    } else {
      savannahSettings.soundOn = true;
    }
    this.setSoundMode();
  }
}
