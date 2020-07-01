import { numberOfWords, percentageOfText } from './statistics_consts';

export default class Chart {
  constructor() {
    this.chart = document.querySelector('.chart');
  }

  drawChart() {
    const ctx = this.chart.getContext('2d');
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let i = 0; i < 2; i += 1) {
      ctx.lineTo(numberOfWords[i], percentageOfText[i]);
    }
    ctx.stroke();
  }
}
