const box = document.querySelectorAll('.box-size');
const text = document.querySelectorAll('.text-size');

function calcTextWidth() {
  Array.from(text).forEach((t) => {
    const parentContainerWidth = t.parentNode.clientWidth;

    const currentTextWidth = t.scrollWidth;
    const currentFontStretch = parseInt(window.getComputedStyle(t).fontStretch, 10);

    const newValue = Math.min(Math.max(300,
      (parentContainerWidth / currentTextWidth) * currentFontStretch), 500);

    t.style.setProperty('--fontStretch', `${newValue}%`);
  });
}

function calcTextSize() {
  Array.from(text).forEach((t) => {
    const parentContainerWidth = t.parentNode.clientWidth;
    const currentTextWidth = t.scrollWidth;
    const currentFontSize = parseInt(window.getComputedStyle(t).fontSize, 10);
    const newValue = Math.min(Math.max(16,
      (parentContainerWidth / currentTextWidth) * currentFontSize), 500);

    t.style.setProperty('--fontSize', `${newValue}px`);
  });
}

function resizeBox() {
  calcTextWidth();
  calcTextSize();
}
resizeBox();
Array.from(box).forEach((b) => {
  new ResizeObserver(resizeBox).observe(b);
});
