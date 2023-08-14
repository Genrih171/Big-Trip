import AbstractView from '../framework/view/abstract-view';
import { humanizeEventTime, DATE_FORMAT } from '../utils/event';

function createTripInfoTemplate(events, offersEvents, destinations) {
  const eventsLength = events.length;

  const getCities = () => {
    const cities = events.map((el) => destinations.find((dest) => dest.id === el.destination).name);
    return cities.length <= 3 ? cities.join(' — ') : `${cities.at(0)} — ... — ${cities.at(-1)}`;
  };

  const tripTime = eventsLength ?
    `${humanizeEventTime(events.at(0).dateFrom, DATE_FORMAT.MONTH)} – ${humanizeEventTime(events.at(-1).dateTo, DATE_FORMAT.DAY)}` : '';

  const eventPrices = [...events.map((el) => el.basePrice)];

  const offersPrices = [];
  events.forEach((ev) => {
    const offersCurrentType = offersEvents.find((offer) => offer.type === ev.type).offers;
    if (offersCurrentType.length) {
      ev.offers.forEach((offerId) => {
        offersPrices.push(offersCurrentType.find((el) => el.id === offerId).price);
      });
    }
  });

  console.log(offersPrices);

  const cost = [...eventPrices, ...offersPrices].reduce((acc, el) => acc + el, 0);

  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getCities()}</h1>

      <p class="trip-info__dates">${tripTime}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>`
  );
}

export default class TripInfoView extends AbstractView {
  #events = null;
  #offersEvents = null;
  #destinations = null;

  constructor(events, offersEvents, destinations) {
    super();
    this.#events = events;
    this.#offersEvents = offersEvents;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate(this.#events, this.#offersEvents, this.#destinations);
  }
}
