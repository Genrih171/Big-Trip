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

const humanizeEventTime = (date, dateFormat = DATE_FORMAT.SHORT) => date ? dayjs(date).format(dateFormat) : '';

const getDiffTime = (date1, date2, diffFormat = DIFF_FORMAT.MINUTE) => dayjs(date1).diff(date2, diffFormat);

const getEventDiffTime = (date1, date2, diffFormat) => {
  let diffTime = getDiffTime(date1, date2, diffFormat);
  if (diffTime > 60) {
    diffTime = `${Math.floor(diffTime / 60)}H ${diffTime % 60}`;
  }
  return `${diffTime}M`;
};

const sortEventTime = (eventA, eventB) => getDiffTime(eventB.dateTo, eventB.dateFrom) - getDiffTime(eventA.dateTo, eventA.dateFrom);

const sortEventPrice = (eventA, eventB) => eventB.basePrice - eventA.basePrice;

export {DATE_FORMAT, humanizeEventTime, getDiffTime, getEventDiffTime, sortEventTime, sortEventPrice};
