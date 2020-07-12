const prependZero = (number) => {
  let temp = number;
  if (temp < 10) {
    temp = `0${temp}`;
  }
  return temp;
};

const getTodayShort = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = prependZero(now.getMonth() + 1);
  const date = prependZero(now.getDate());

  return `${year}-${month}-${date}`;
};

export const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = prependZero(date.getMonth() + 1);
  const dateDay = prependZero(date.getDate());
  const hours = prependZero(date.getHours());
  const minutes = prependZero(date.getMinutes());

  return `${hours}:${minutes} ${dateDay}.${month}.${year}`;
};

export const renderNewLanguageInElement = (element, language) => {
  const elementsToChange = element.querySelectorAll(`[data-${language}]`);
  elementsToChange.forEach((elementToChange) => {
    const elementTemp = elementToChange;
    elementTemp.innerText = elementTemp.dataset[language];
  });
};

export default getTodayShort;
