const counterArray = [];

const updateScore = () => {
  const score = counterArray.reduce((acc, val) => acc + val, 0).toString().split('');
  if (score.length === 3) {
    const a = [score[0], score[1], score[2]];
    [document.querySelector('.counter__third-number').textContent, document.querySelector('.counter__second-number').textContent, document.querySelector('.counter__first-number').textContent] = a;
  }
  if (score.length === 2) {
    const a = [score[0], score[1]];
    [document.querySelector('.counter__second-number').textContent, document.querySelector('.counter__first-number').textContent] = a;
  }
  if (score.length === 4) {
    document.querySelector('.counter').innerHTML = ` 
        <span class="counter__box counter__fourth-number">0</span>
        <span class="counter__box counter__third-number">0</span>
        <span class="counter__box counter__second-number">0</span>
        <span class="counter__box counter__first-number">0</span>
        `;
    const a = [score[0], score[1], score[2], score[3]];
    [document.querySelector('.counter__third-number').textContent, document.querySelector('.counter__third-number').textContent, document.querySelector('.counter__second-number').textContent, document.querySelector('.counter__first-number').textContent] = a;
  }
};

export { updateScore, counterArray };
