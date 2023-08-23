import { FilterTypes } from '../const';
import dayjs from 'dayjs';

const filter = {
  [FilterTypes.EVERYTHING]: (events) => events,
  [FilterTypes.FUTURE]: (events) => events.filter((el) => dayjs(el.dateFrom) > dayjs()),
  [FilterTypes.PRESENT]: (events) => events.filter((el) => dayjs(el.dateFrom) <= dayjs() && dayjs(el.dateTo) >= dayjs()),
  [FilterTypes.PAST]: (events) => events.filter((el) => dayjs(el.dateTo) < dayjs()),
};

export {filter};
