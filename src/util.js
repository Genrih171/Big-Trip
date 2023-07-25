import dayjs from 'dayjs';

const DATE_FORMAT = {
  SHORT: 'HH:mm',
  FULL: 'DD/MM/YY HH:mm',
  MONTH: 'MMM DD'
};

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

const humanizeEventTime = (date, dateFormat = DATE_FORMAT.SHORT) => date ? dayjs(date).format(dateFormat) : '';

const getDifferenceTime = (date1, date2) => dayjs(date1).diff(date2, 'minute');

export {getRandomArrayElement, humanizeEventTime, getDifferenceTime, DATE_FORMAT};
