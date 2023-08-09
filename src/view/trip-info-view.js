import AbstractView from '../framework/view/abstract-view';
import { humanizeEventTime, DATE_FORMAT } from '../utils/event';

function createTripInfoTemplate(events) {
  const eventsLength = events.length;

  const getCities = () => {
    const cities = events.map((el) => el.destination.name);
    return cities.length <= 3 ? cities.join(' — ') : `${cities.at(0)} — ... — ${cities.at(-1)}`;
  };

  const tripTime = eventsLength ?
    `${humanizeEventTime(events.at(0).dateFrom, DATE_FORMAT.MONTH)} – ${humanizeEventTime(events.at(-1).dateTo, DATE_FORMAT.DAY)}` : '';

  const cost = events.reduce((acc, el) => acc + el.basePrice, 0);

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

  constructor(events) {
    super();
    this.#events = events;
  }

  get template() {
    return createTripInfoTemplate(this.#events);
  }
}
