import { getRandomArrayElement } from '../utils/common.js';
import { nanoid } from 'nanoid';


const events = [{
  basePrice: 500,
  dateFrom: new Date('2023-08-22T22:55:56.845Z'),
  dateTo: new Date('2023-08-24T11:22:13.375Z'),
  destination: 1,
  isFavorite: false,
  offers: [],
  type: 'taxi',
},
{
  basePrice: 900,
  dateFrom: new Date('2023-08-22T22:40:56.845Z'),
  dateTo: new Date('2023-08-24T11:00:13.375Z'),
  destination: 2,
  isFavorite: false,
  offers: [2, 3],
  type: 'train',
},
{
  basePrice: 1500,
  dateFrom: new Date('2023-09-15T09:30:56.845Z'),
  dateTo: new Date('2023-09-15T19:45:13.375Z'),
  destination: 3,
  isFavorite: true,
  offers: [1, 3],
  type: 'ship',
},
{
  basePrice: 2500,
  dateFrom: new Date('2023-09-16T18:50:56.845Z'),
  dateTo: new Date('2023-09-16T19:30:13.375Z'),
  destination: 4,
  isFavorite: false,
  offers: [1],
  type: 'drive',
},
{
  basePrice: 800,
  dateFrom: new Date('2023-07-18T04:30:56.845Z'),
  dateTo: new Date('2023-07-18T15:40:13.375Z'),
  destination: 5,
  isFavorite: true,
  offers: [3],
  type: 'flight',
},];

const getRandomEvent = () => ({
  id: nanoid(),
  ...getRandomArrayElement(events)
});

export {getRandomEvent};
