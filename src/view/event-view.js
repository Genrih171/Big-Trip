import { humanizeEventTime, getDifferenceTime, DATE_FORMAT} from '../util';
import { createElement } from '../render';

function createTripEventTemplate(event) {
  const {basePrice, dateFrom, dateTo, type, destination, isFavorite, offers} = event;

  const eventDateFrom = humanizeEventTime(dateFrom);
  const eventDateTo = humanizeEventTime(dateTo);
  const eventDateMonth = humanizeEventTime(dateFrom, DATE_FORMAT.MONTH);
  const getEventDiffTime = () => {
    let diffTime = getDifferenceTime(dateTo, dateFrom);
    if (diffTime > 60) {
      diffTime = `${Math.floor(diffTime / 60)}H ${diffTime % 60}`;
    }
    return `${diffTime}M`;
  };

  const eventType = Array.from(type)[0].toUpperCase() + type.slice(1);
  const city = destination.name;

  const eventOffers = offers.map((el) =>
    `<li class="event__offer">
    <span class="event__offer-title">${el.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${el.price}</span>
  </li>`
  ).join('');

  const favoriteClass = (isFavorite) ? 'event__favorite-btn--active' : '';

  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${eventDateMonth}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${eventType} ${city}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${eventDateFrom}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${eventDateTo}</time>
        </p>
        <p class="event__duration">${getEventDiffTime()}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${eventOffers}
      </ul>
      <button class="event__favorite-btn ${favoriteClass}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
}

export default class EventView {
  constructor({event}) {
    this.event = event;
  }

  getTemplate() {
    return createTripEventTemplate(this.event);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
