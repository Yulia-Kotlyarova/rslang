import { diagramData, diagramDataKeys } from './statistics_consts';

export default class Chart {
  constructor() {
    this.chart = document.querySelector('.statistics__chart');
    this.chartRange = document.querySelector('.chart-range');
    this.chartWordsNumber = document.querySelector('.chart__number-of-words');
    this.percentageOfWordsContainer = document.querySelector('.percentage-of-words');
    this.totalWordsNumber = 266;
    this.percentageOfWords = 0;
  }

  updateTotalWordsNumber() {
    this.totalWordsNumber = diagramDataKeys[this.chartRange.value];
    this.chartWordsNumber.innerText = `Слов: ${this.totalWordsNumber}`;
    this.percentageOfWordsContainer.innerText = `${this.percentageOfWords}% слов любого текста`;
  }

  drawMainChart() {
    const diagramWidth = this.chart.clientWidth;
    const diagramHeight = this.chart.clientHeight;
    this.chart.width = diagramWidth;
    this.chart.height = diagramHeight;
    if (this.chart.getContext) {
      const ctx = this.chart.getContext('2d');
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#6868a7';
      ctx.beginPath();
      ctx.moveTo(0, 500);
      for (let i = 0; i < diagramDataKeys.length; i += 1) {
        const coordX = (diagramWidth / 5000) * diagramDataKeys[i];
        const coordY = diagramHeight - (diagramHeight / 100) * diagramData[diagramDataKeys[i]];
        ctx.lineTo(coordX, coordY);
      }
      ctx.lineTo(diagramWidth, diagramHeight);
      ctx.lineTo(0, diagramHeight);
      ctx.fillStyle = '#d7d7ff';
      ctx.fill();
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'none';
      ctx.beginPath();
      ctx.moveTo(0, 500);
      for (let i = 0; i < diagramDataKeys.length; i += 1) {
        const coordX = (diagramWidth / 5000) * diagramDataKeys[i];
        const wordsCoordX = (diagramWidth / 5000) * this.totalWordsNumber;
        const coordY = diagramHeight - (diagramHeight / 100) * diagramData[diagramDataKeys[i]];
        if (wordsCoordX > coordX) {
          ctx.lineTo(coordX, coordY);
        } else {
          this.percentageOfWords = diagramData[diagramDataKeys[i]];
          ctx.lineTo(wordsCoordX, coordY);
          ctx.lineTo(wordsCoordX, diagramHeight);
          ctx.lineTo(0, diagramHeight);
          ctx.fillStyle = '#9c9cb8';
          ctx.fill();
          ctx.stroke();
          break;
        }
      }
      ctx.fillStyle = '#51b8a17e';
      ctx.fill();
      ctx.stroke();

      const oneFifthPartWidth = diagramWidth / 5;
      ctx.strokeStyle = '#afafb1';
      for (let i = 1; i < 6; i += 1) {
        ctx.beginPath();
        ctx.moveTo(oneFifthPartWidth * i, 0);
        ctx.lineTo(oneFifthPartWidth * i, diagramHeight);
        ctx.stroke();
      }

      const oneFifthPartHeight = diagramHeight / 5;
      for (let i = 0; i < 6; i += 1) {
        ctx.beginPath();
        ctx.moveTo(0, oneFifthPartHeight * i);
        ctx.lineTo(diagramWidth, oneFifthPartHeight * i);
        ctx.stroke();
      }
    }
  }

  // drawMainChart() {
  //   const diagramWidth = this.chart.clientWidth;
  //   const diagramHeight = this.chart.clientHeight;
  //   this.chart.width = diagramWidth;
  //   this.chart.height = diagramHeight;
  //   if (this.chart.getContext) {
  //     const ctx = this.chart.getContext('2d');
  //     ctx.lineWidth = 1;
  //     ctx.strokeStyle = '#6868a7';
  //     ctx.beginPath();
  //     ctx.moveTo(0, 500);
  //     for (let i = 0; i < diagramData.length; i += 1) {
  //       const coordX = (diagramWidth / 5000) * diagramData[i][0];
  //       const coordY = diagramHeight - (diagramHeight / 100) * diagramData[i][1];
  //       ctx.lineTo(coordX, coordY);
  //     }
  //     ctx.lineTo(diagramWidth, diagramHeight);
  //     ctx.lineTo(0, diagramHeight);
  //     ctx.fillStyle = '#d7d7ff';
  //     ctx.fill();
  //     ctx.stroke();

  //     ctx.lineWidth = 1;
  //     ctx.strokeStyle = 'none';
  //     ctx.beginPath();
  //     ctx.moveTo(0, 500);
  //     for (let i = 0; i < diagramData.length; i += 1) {
  //       const coordX = (diagramWidth / 5000) * diagramData[i][0];
  //       const wordsCoordX = (diagramWidth / 5000) * this.totalWordsNumber;
  //       const coordY = diagramHeight - (diagramHeight / 100) * diagramData[i][1];
  //       if (wordsCoordX > coordX) {
  //         ctx.lineTo(coordX, coordY);
  //       } else {
  //         ctx.lineTo(wordsCoordX, coordY);
  //         ctx.lineTo(wordsCoordX, diagramHeight);
  //         ctx.lineTo(0, diagramHeight);
  //         ctx.fillStyle = '#9c9cb8';
  //         ctx.fill();
  //         ctx.stroke();
  //         break;
  //       }
  //     }
  //     ctx.fillStyle = '#51b8a17e';
  //     ctx.fill();
  //     ctx.stroke();

  //     const oneFifthPartWidth = diagramWidth / 5;
  //     ctx.strokeStyle = '#afafb1';
  //     for (let i = 1; i < 6; i += 1) {
  //       ctx.beginPath();
  //       ctx.moveTo(oneFifthPartWidth * i, 0);
  //       ctx.lineTo(oneFifthPartWidth * i, diagramHeight);
  //       ctx.stroke();
  //     }

  //     const oneFifthPartHeight = diagramHeight / 5;
  //     for (let i = 0; i < 6; i += 1) {
  //       ctx.beginPath();
  //       ctx.moveTo(0, oneFifthPartHeight * i);
  //       ctx.lineTo(diagramWidth, oneFifthPartHeight * i);
  //       ctx.stroke();
  //     }
  //   }
  // }

  setEventListeners() {
    this.chartRange.addEventListener('change', () => this.updateDiagram());
  }

  updateDiagram() {
    this.updateTotalWordsNumber();
    this.drawMainChart();
  }
}
