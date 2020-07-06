// arrayWord, arrayWordTranslate

const objForCorrectWord = {
  eng: [],
  ru: [],
  audio: [],
};

console.log(objForCorrectWord);
const endGame = document.querySelector('.sectionStart__closeBtn');
const addHide = document.querySelector('.sectionStart');
const openModal = document.querySelector('.modalScr');
const scrCorrectCount = document.getElementById('modalScr__correct-count');
const closeStat = document.querySelector('.modalScr__closeBtn');

const addWordsToModal = (array, array1, array2) => {
  const list = document.createElement('ul');
  for (let i = 0; i < array1.length; i += 1) {
    const item = document.createElement('li');
    item.innerHTML = `<button onclick="clickTune('${array[i]}')"><i class="fas fa-volume-down"></i></button> `;
    item.appendChild(document.createTextNode(`${array1[i]} - ${array2[i]}`));
    list.appendChild(item);
  }
  return list;
};

const scrOpenModal = () => {
  scrCorrectCount.textContent = objForCorrectWord.eng.length;
  document.querySelector('.modalScr__correct').appendChild(addWordsToModal(objForCorrectWord.audio, objForCorrectWord.eng, objForCorrectWord.ru));
};

const closeModal = () => {
  closeStat.addEventListener('click', () => {
    openModal.classList.add('modelHide');
  });
};

const finishGame = () => {
  endGame.addEventListener('click', () => {
    addHide.classList.add('gameStart-hidden');
    openModal.classList.remove('modelHide');
    scrOpenModal();
    closeModal();
  });
};

export { objForCorrectWord, finishGame };
