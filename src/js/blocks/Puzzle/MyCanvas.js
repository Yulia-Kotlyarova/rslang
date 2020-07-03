import { puzzlePadding } from './appState';

export default function drawPuzzleContour(puzzleElementCanvas, puzzleElementPosition) {
  const element = puzzleElementCanvas;
  const width = element.clientWidth;
  const height = element.clientHeight;
  const radius = (puzzlePadding / 3) * 2;
  element.width = width;
  element.height = height;

  if (element.getContext) {
    const ctx = element.getContext('2d');
    const triangleSide = Math.sqrt(radius ** 2 - (radius / 2) ** 2);
    const angle = Math.PI - Math.asin(triangleSide / radius);
    const sideSmall = Math.sqrt((radius ** 2) * 2 - (2 * radius) * radius
    * Math.cos(angle / Math.PI / 180));
    const side = Math.sqrt(sideSmall ** 2 - (radius / 2) ** 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF';
    if (puzzleElementPosition === 'first') {
      ctx.beginPath();
      ctx.moveTo(1, 1);
      ctx.lineTo(width - (radius / 2) * 3, 1);
      ctx.lineTo(width - (radius / 2) * 3, height / 2 - radius + side);
      ctx.arc(width - radius, height / 2, radius, -angle, angle, false);
      ctx.lineTo(width - (radius / 2) * 3, height);
      ctx.lineTo(1, height);
      ctx.lineTo(1, 1);
    } else if (puzzleElementPosition === 'last') {
      ctx.beginPath();
      ctx.moveTo(1, 1);
      ctx.lineTo(width - 1, 1);
      ctx.lineTo(width - 1, height);
      ctx.lineTo(width - (radius / 2) * 3, height);
      ctx.lineTo(1, height);
      ctx.lineTo(1, height / 2 + radius - side);
      ctx.arc(radius / 2 + 1, height / 2, radius, angle, -angle, true);
      ctx.lineTo(1, 1);
    } else if (puzzleElementPosition === 'middle') {
      ctx.beginPath();
      ctx.moveTo(1, 1);
      ctx.lineTo(width - (radius / 2) * 3, 1);
      ctx.lineTo(width - (radius / 2) * 3, height / 2 - radius + side);
      ctx.arc(width - radius, height / 2, radius, -angle, angle, false);
      ctx.lineTo(width - (radius / 2) * 3, height);
      ctx.lineTo(1, height);
      ctx.lineTo(1, height / 2 + radius - side);
      ctx.arc(radius / 2 + 1, height / 2, radius, angle, -angle, true);
      ctx.lineTo(1, 1);
    }
    ctx.fillStyle = '#4a6168';
    ctx.fill();
    ctx.stroke();
    ctx.clip();
  }
}
