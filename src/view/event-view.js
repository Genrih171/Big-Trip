import AbstractView from '../framework/view/abstract-view';
import { humanizeEventTime, getEventDiffTime, DATE_FORMAT} from '../utils/event';

function createEventTemplate(event, offersCurrentType, destination) {
  const {basePrice, dateFrom, dateTo, offers, type, isFavorite} = event;

  const eventDateFrom = humanizeEventTime(dateFrom);
  const eventDateTo = humanizeEventTime(dateTo);
  const eventDateMonth = humanizeEventTime(dateFrom, DATE_FORMAT.MONTH);

  const eventType = Array.from(type)[0].toUpperCase() + type.slice(1);

  const offersEvent = offers.map((id) =>
    `<li class="event__offer">
    <span class="event__offer-title">${offersCurrentType.find((el) => el.id === id).title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offersCurrentType.find((el) => el.id === id).price}</span>
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
      <h3 class="event__title">${eventType} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${eventDateFrom}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${eventDateTo}</time>
        </p>
        <p class="event__duration">${getEventDiffTime(dateTo, dateFrom)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersEvent}
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

export default class EventView extends AbstractView {
  #event = null;
  #offersCurrentType = null;
  #destination = null;
  #handleClick = null;
  #handlefavoriteClick = null;

  constructor({event, offersEvents, destinations, onClick, onFavoriteClick}) {
    super();
    this.#event = event;
    this.#offersCurrentType = offersEvents.find((offer) => offer.type === this.#event.type).offers;
    this.#destination = destinations.find((el) => el.id === this.#event.destination);
    this.#handleClick = onClick;
    this.#handlefavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createEventTemplate(this.#event, this.#offersCurrentType, this.#destination);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handlefavoriteClick();
  };
}
