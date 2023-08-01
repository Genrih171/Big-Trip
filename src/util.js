import dayjs from 'dayjs';

const DATE_FORMAT = {
  SHORT: 'HH:mm',
  FULL: 'DD/MM/YY HH:mm',
  MONTH: 'MMM DD'
};

const DIFF_FORMAT = {
  MINUTE: 'minute',
};

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const humanizeEventTime = (date, dateFormat = DATE_FORMAT.SHORT) => date ? dayjs(date).format(dateFormat) : '';

const getDifferenceTime = (date1, date2, diffFormat = DIFF_FORMAT.MINUTE) => dayjs(date1).diff(date2, diffFormat);

const getEventDiffTime = (date1, date2, diffFormat) => {
  let diffTime = getDifferenceTime(date1, date2, diffFormat);
  if (diffTime > 60) {
    diffTime = `${Math.floor(diffTime / 60)}H ${diffTime % 60}`;
  }
  return `${diffTime}M`;
};

const isEscapeKey = (evt) => evt.key === 'Escape';

export {getRandomArrayElement, humanizeEventTime, getDifferenceTime, getEventDiffTime, isEscapeKey, DATE_FORMAT};
