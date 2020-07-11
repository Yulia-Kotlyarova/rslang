import { chartData, chartDataKeys } from './statistics_consts';
import Repository from '../../modules/Repository';
import MessageModal from '../../modules/MessageModal';

export default class Chart {
  constructor() {
    this.chart = document.querySelector('.statistics__chart');
    this.chartRange = document.querySelector('.chart-range');
    this.chartWordsNumber = document.querySelector('.chart__number-of-words').lastChild;
    this.percentageOfWordsContainer = document.querySelector('.percentage-of-words').firstChild;
    this.chartCircle = document.querySelector('.chart__circle');
    this.totalWordsNumber = 0;
    this.percentageOfWords = 0;
  }

  async renderUserChart() {
    function deleteErrorModal() {
      const userStatisticError = document.querySelector('.user-statistic-error');
      document.body.removeChild(userStatisticError);
    }
    if (localStorage.getItem('token')) {
      try {
        this.totalWordsNumber = await Chart.updateTotalWordsNumber();
      } catch (error) {
        this.totalWordsNumber = 0;
        this.percentageOfWords = 0;
        const messageModal = new MessageModal();
        MessageModal.createModalHTML('user-statistic-error');
        messageModal.appendSelf('user-statistic-error');
        MessageModal.showModal('Sorry, something went wrong', deleteErrorModal);
      }
    }
    this.chartRange.value = this.calculateChartRangeValue();
    this.percentageOfWords = chartData[chartDataKeys[this.chartRange.value]];
    this.chartWordsNumber.innerText = `${this.totalWordsNumber}`;
    this.percentageOfWordsContainer.innerText = `${this.percentageOfWords}% `;
    this.drawChart();
  }

  static async updateTotalWordsNumber() {
    const statistics = await Repository.getStatistics();
    return statistics.learnedWords;
  }

  calculateChartRangeValue() {
    return chartDataKeys.filter((key) => key < this.totalWordsNumber).length - 1;
  }

  drawChart() {
    const chartWidth = this.chart.clientWidth;
    const chartHeight = this.chart.clientHeight;
    this.chart.width = chartWidth;
    this.chart.height = chartHeight;

    if (this.chart.getContext) {
      const ctx = this.chart.getContext('2d');
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#6868a7';
      ctx.beginPath();
      ctx.moveTo(0, 500);
      for (let i = 0; i < chartDataKeys.length; i += 1) {
        const coordX = (chartWidth / 5000) * chartDataKeys[i];
        const coordY = chartHeight - (chartHeight / 100) * chartData[chartDataKeys[i]];
        ctx.lineTo(coordX, coordY);
      }
      ctx.lineTo(chartWidth, chartHeight);
      ctx.lineTo(0, chartHeight);
      ctx.fillStyle = '#d7d7ff';
      ctx.fill();
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'none';
      ctx.beginPath();
      ctx.moveTo(0, 500);
      for (let i = 0; i < chartDataKeys.length; i += 1) {
        const coordX = (chartWidth / 5000) * chartDataKeys[i];
        const wordsCoordX = (chartWidth / 5000) * this.totalWordsNumber;
        const coordY = chartHeight - (chartHeight / 100) * chartData[chartDataKeys[i]];
        if (wordsCoordX > coordX) {
          ctx.lineTo(coordX, coordY);
        } else {
          this.percentageOfWords = chartData[chartDataKeys[i]];
          ctx.lineTo(wordsCoordX, coordY);
          ctx.lineTo(wordsCoordX, chartHeight);
          ctx.lineTo(0, chartHeight);
          ctx.fillStyle = '#9c9cb8';
          ctx.fill();
          ctx.stroke();
          this.moveChartCircle(wordsCoordX, coordY);
          break;
        }
      }
      ctx.fillStyle = '#51b8a17e';
      ctx.fill();

      const oneFifthPartWidth = chartWidth / 5;
      ctx.strokeStyle = '#afafb1';
      for (let i = 1; i < 6; i += 1) {
        ctx.beginPath();
        ctx.moveTo(oneFifthPartWidth * i, 0);
        ctx.lineTo(oneFifthPartWidth * i, chartHeight);
        ctx.stroke();
      }

      const oneFifthPartHeight = chartHeight / 5;
      for (let i = 0; i < 6; i += 1) {
        ctx.beginPath();
        ctx.moveTo(0, oneFifthPartHeight * i);
        ctx.lineTo(chartWidth, oneFifthPartHeight * i);
        ctx.stroke();
      }
    }
  }

  moveChartCircle(wordsCoordX, coordY) {
    const circleRadius = this.chartCircle.clientWidth / 2;
    this.chartCircle.style.left = `${wordsCoordX - circleRadius}px`;
    this.chartCircle.style.top = `${coordY - circleRadius}px`;
  }

  setEventListeners() {
    this.chartRange.addEventListener('change', () => this.updatechart());
  }

  updatechart() {
    const chartRangeValue = this.chartRange.value;
    this.totalWordsNumber = chartDataKeys[chartRangeValue];
    this.percentageOfWords = chartData[chartDataKeys[chartRangeValue]];
    this.chartWordsNumber.innerText = `${this.totalWordsNumber}`;
    this.percentageOfWordsContainer.innerText = `${this.percentageOfWords}% `;
    this.drawChart();
  }
}
