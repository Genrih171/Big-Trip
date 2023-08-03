import AbstractView from '../framework/view/abstract-view';
import { humanizeEventTime, DATE_FORMAT } from '../util';

function createTripInfoTemplate(events) {
  const eventsLength = events.length;

  const getCities = () => {
    if (eventsLength) {
      const cities = [events[0].destination.name];
      for (let i = 1; i < eventsLength; i++) {
        if (events[i].destination.name !== events[i - 1].destination.name) {
          cities.push(events[i].destination.name);
        }
      }
      return cities.length <= 3 ? cities.join(' — ') : `${cities[0]} — ... — ${cities[cities.length - 1]}`;
    }

    return '';
  };

  const getTripTime = () => eventsLength ?
    `${humanizeEventTime(events[0].dateFrom, DATE_FORMAT.MONTH)} – ${humanizeEventTime(events[eventsLength - 1].dateTo, DATE_FORMAT.DAY)}` : '';

  const getCost = () => events.reduce((acc, el) => acc + el.basePrice, 0);

  return (
    `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getCities()}</h1>

      <p class="trip-info__dates">${getTripTime()}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getCost()}</span>
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
