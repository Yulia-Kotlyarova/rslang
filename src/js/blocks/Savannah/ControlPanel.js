import { soundOn, soundOff } from './consts';
import { savannahSettings } from './appState';

export default class ControlPanel {
  constructor() {
    this.controlSoundContainer = document.querySelector('.control__sound');
  }

  setEventListeners() {
    this.controlSoundContainer.addEventListener('click', () => this.switchSoundMode());
  }

  setSoundModeOnLoad() {
    const isSoundOn = JSON.parse(localStorage.getItem('savannaSound'));
    if (isSoundOn === null || isSoundOn) {
      localStorage.setItem('savannaSound', true);
      savannahSettings.soundOn = true;
      this.controlSoundContainer.innerHTML = soundOn;
    } else {
      savannahSettings.soundOn = false;
      this.controlSoundContainer.innerHTML = soundOff;
    }
  }

  switchSoundMode() {
    savannahSettings.soundOn = !savannahSettings.soundOn;
    if (savannahSettings.soundOn) {
      localStorage.setItem('savannaSound', true);
      this.controlSoundContainer.innerHTML = soundOn;
    } else {
      localStorage.setItem('savannaSound', false);
      this.controlSoundContainer.innerHTML = soundOff;
    }
  }
}
