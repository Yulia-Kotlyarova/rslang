const getTodayShort = () => {
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let date = now.getDate();
  if (date < 10) {
    date = `0${date}`;
  }
  return `${year}-${month}-${date}`;
};

export default getTodayShort;
