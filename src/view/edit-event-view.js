import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { humanizeEventTime, isChecked, DATE_FORMAT} from '../utils/event';
import { EventTypes } from '../const';

const BLANK_EVENT = {
  basePrice: '',
  dateFrom: '',
  dateTo: '',
  destination: {
    id: 1,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    name: 'Amsterdam',
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=1',
        description: 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.'
      },
      {
        src: 'https://loremflickr.com/248/152?random=2',
        description: 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.'
      },
      {
        src: 'https://loremflickr.com/248/152?random=3',
        description: 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.'
      },
    ]
  },
  id: '',
  isFavorite: false,
  offers: '',
  type: 'taxi',
};

const BLANK_OFFERS = [{
  type: 'taxi',
  offers: [{
    id: 1,
    title: 'Blowjob',
    price: 120
  },
  {
    id: 2,
    title: 'Offer 2',
    price: 300
  },
  {
    id: 3,
    title: 'Offer 3',
    price: 500
  },
  {
    id: 4,
    title: 'Offer 4',
    price: 770
  }]
}];

function createEditEventTemplate(state, offersEvents, destinations) {
  const {basePrice, dateFrom, dateTo, offers, type} = state;

  const eventDateFrom = humanizeEventTime(dateFrom, DATE_FORMAT.FULL);
  const eventDateTo = humanizeEventTime(dateTo, DATE_FORMAT.FULL);

  const eventType = Array.from(type)[0].toUpperCase() + type.slice(1);

  const destination = destinations.find((el) => el.id === state.destination);

  const offersCurrentType = offersEvents.find((offer) => offer.type === state.type).offers;

  const offersButtons = offersCurrentType.length ? `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offersCurrentType.map((el) =>
    `<div class="event__offer-selector" data-offer-id="${el.id}">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${el.id}" type="checkbox" name="event-offer-luggage"
        ${isChecked(offers.includes(el.id))}>
        <label class="event__offer-label" for="event-offer-${type}-${el.id}">
          <span class="event__offer-title">${el.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${el.price}</span>
        </label>
      </div>`
  ).join('')}
    </div>
  </section>` : '';

  const photos =
    `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${destination.pictures.map((el) => `<img class="event__photo" src=${el.src} alt=${el.description}>`).join('')}
    </div>
  </div>`;

  const eventTypesList = EventTypes.map((evType) =>
    `<div class="event__type-item">
    <input id="event-type-${evType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${evType}"
    ${isChecked(evType === type)}>
    <label class="event__type-label  event__type-label--${evType}" for="event-type-${evType}-1">
    ${Array.from(evType)[0].toUpperCase() + evType.slice(1)}</label>
  </div>`
  ).join('');

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${eventTypesList}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${eventType}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${eventDateFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${eventDateTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">

        ${offersButtons}

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>

          ${photos}
        </section>
      </section>
    </form>
  </li>`
  );
}

export default class EditEventView extends AbstractStatefulView {
  #offersEvents = null;
  #destinations = null;

  #handleSubmitForm = null;
  #handleChangeForm = null;

  constructor({event = BLANK_EVENT, offersEvents = BLANK_OFFERS, destinations, onChangeForm, onSubmitForm}) {
    super();
    this._setState(event);
    this.#offersEvents = offersEvents;
    this.#destinations = destinations;
    this.#handleChangeForm = onChangeForm;
    this.#handleSubmitForm = onSubmitForm;

    this._restoreHandlers();
  }

  get template() {
    return createEditEventTemplate(this._state, this.#offersEvents, this.#destinations);
  }

  reset(event) {
    this.updateElement(event);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#changeFormHandler);
    this.element.querySelector('form').addEventListener('submit', this.#submitFormHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#eventTypeChangeHandler);

    const offersContainer = this.element.querySelector('.event__available-offers');
    if (offersContainer) {
      offersContainer.addEventListener('change', this.#offersChangeHandler);
    }
  }

  #changeFormHandler = () => this.#handleChangeForm();

  #submitFormHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmitForm();
  };

  #eventTypeChangeHandler = (evt) => {
    if (!evt.target.closest('.event__type-input')) {
      return;
    }

    evt.target.parentElement.querySelector('input').checked = true;
    this.updateElement({type: evt.target.closest('.event__type-input').value});
  };

  #offersChangeHandler = (evt) => {
    const offerId = +evt.target.closest('.event__offer-selector').dataset.offerId;
    if (!this._state.offers.includes(offerId)) {
      this._state.offers.push(offerId);
      return;
    }

    this._state.offers = this._state.offers.filter((el) => el !== offerId);
  };
}
