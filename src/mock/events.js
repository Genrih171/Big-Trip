import { destinations } from './destinations.js';
import { offersByType } from './offers.js';
import { getRandomArrayElement } from '../util.js';


const events = [{
  basePrice: 500,
  dateFrom: new Date('2019-07-10T22:55:56.845Z'),
  dateTo: new Date('2019-07-11T11:22:13.375Z'),
  destination: 1,
  id: 1,
  isFavorite: false,
  offers: [1, 4],
  type: 'bus',
},
{
  basePrice: 900,
  dateFrom: new Date('2019-07-14T15:40:56.845Z'),
  dateTo: new Date('2019-07-14T16:00:13.375Z'),
  destination: 2,
  id: 2,
  isFavorite: false,
  offers: [2, 3],
  type: 'train',
},
{
  basePrice: 1500,
  dateFrom: new Date('2019-07-15T09:30:56.845Z'),
  dateTo: new Date('2019-07-15T19:45:13.375Z'),
  destination: 3,
  id: 3,
  isFavorite: true,
  offers: [1, 3],
  type: 'ship',
},
{
  basePrice: 2500,
  dateFrom: new Date('2019-07-16T18:50:56.845Z'),
  dateTo: new Date('2019-07-16T19:30:13.375Z'),
  destination: 4,
  id: 4,
  isFavorite: false,
  offers: [1],
  type: 'drive',
},
{
  basePrice: 800,
  dateFrom: new Date('2019-07-18T04:30:56.845Z'),
  dateTo: new Date('2019-07-18T15:40:13.375Z'),
  destination: 5,
  id: 5,
  isFavorite: true,
  offers: [3],
  type: 'flight',
},];

const addDestinations = (itemsEvents, itemsDestinations) => {
  itemsEvents.forEach((el) => {
    el.destination = itemsDestinations.find((destination) => destination.id === el.destination);
  });
};

const addOffers = (itemsEvents, itemsOffers) => {
  itemsEvents.forEach((event) => {
    const currentOfferType = itemsOffers.find((el) => el.type === event.type);
    event.offers = event.offers.map((el) => currentOfferType.offers.find((offer) => offer.id === el));
  });
};

const getRandomEvent = () => getRandomArrayElement(events);

addDestinations(events, destinations);
addOffers(events, offersByType);

export {getRandomEvent};
