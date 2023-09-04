import dayjs from 'dayjs';

const DATE_FORMAT = {
  SHORT: 'HH:mm',
  FULL: 'DD/MM/YY HH:mm',
  DAY: 'DD',
  MONTH: 'MMM DD'
};

const DIFF_FORMAT = {
  MINUTE: 'minute',
};

const NUMBER_MINUTES = {
  MINUTE_DAY: 1440,
  MINUTE_HOUR: 60,
};

const humanizeEventTime = (date, dateFormat = DATE_FORMAT.SHORT) => date ? dayjs(date).format(dateFormat) : '';

const getDiffTime = (date1, date2, diffFormat = DIFF_FORMAT.MINUTE) => dayjs(date1).diff(date2, diffFormat);

const getEventDiffTime = (date1, date2, diffFormat) => {
  let diffTime = getDiffTime(date1, date2, diffFormat);

  if (diffTime > NUMBER_MINUTES.MINUTE_DAY) {
    diffTime = `${Math.floor(diffTime / NUMBER_MINUTES.MINUTE_DAY)}D ${Math.floor(diffTime % NUMBER_MINUTES.MINUTE_DAY / NUMBER_MINUTES.MINUTE_HOUR)}H ${diffTime % NUMBER_MINUTES.MINUTE_DAY % NUMBER_MINUTES.MINUTE_HOUR}`;
  }

  if (diffTime > NUMBER_MINUTES.MINUTE_HOUR) {
    diffTime = `${Math.floor(diffTime / NUMBER_MINUTES.MINUTE_HOUR)}H ${diffTime % NUMBER_MINUTES.MINUTE_HOUR}`;
  }
  return `${diffTime}M`;
};

const sortEventTime = (eventA, eventB) => getDiffTime(eventB.dateTo, eventB.dateFrom) - getDiffTime(eventA.dateTo, eventA.dateFrom);

const sortEventPrice = (eventA, eventB) => eventB.basePrice - eventA.basePrice;

const sortEventDay = (eventA, eventB) => {
  const result = getDiffTime(eventA.dateTo, eventB.dateTo);

  if (result < 0) {
    return -1;
  }

  if (result > 0) {
    return 1;
  }

  return 0;
};

const isDateEqual = (dateA, dateB) => dayjs(dateA).isSame(dateB, 'minute');

export {DATE_FORMAT, humanizeEventTime, getDiffTime, getEventDiffTime, sortEventTime, sortEventPrice, sortEventDay, isDateEqual};
