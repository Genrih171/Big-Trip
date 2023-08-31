import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { humanizeEventTime, DATE_FORMAT} from '../utils/event';
import { EventTypes } from '../const';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const PATTERN = /[^\d]/g;

const BLANK_EVENT = {
  basePrice: '',
  dateFrom: '',
  dateTo: '',
  destination: '',
  id: '',
  isFavorite: false,
  offers: [],
  type: 'taxi',
};

function createEditEventTemplate(state, offersEvents, destinations) {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = state;

  const eventDateFrom = humanizeEventTime(dateFrom, DATE_FORMAT.FULL);
  const eventDateTo = humanizeEventTime(dateTo, DATE_FORMAT.FULL);

  const eventType = Array.from(type)[0].toUpperCase() + type.slice(1);

  const destinationEvent = destinations.find((el) => el.id === destination);

  const nameCity = destinationEvent ? destinationEvent.name : '';

  const namesCityList = destinations.map((el) =>`<option value="${el.name}">${el.name}</option>`).join('');

  const destinationContainer = destinationEvent ?
    `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destinationEvent.description}</p>

    <div class="event__photos-container">
    <div class="event__photos-tape">
      ${destinationEvent.pictures.map((el) => `<img class="event__photo" src=${el.src} alt=${el.description}>`).join('')}
    </div>
  </div>
  </section>` : '';

  const offersCurrentType = offersEvents.find((offer) => offer.type === type).offers;

  const offersButtons = offersCurrentType.length ? `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offersCurrentType.map((el) =>
    `<div class="event__offer-selector" data-offer-id="${el.id}">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${el.id}" type="checkbox" name="event-offer-luggage"
        ${offers.includes(el.id) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${type}-${el.id}">
          <span class="event__offer-title">${el.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${el.price}</span>
        </label>
      </div>`
  ).join('')}
    </div>
  </section>` : '';

  const eventTypesList = EventTypes.map((evType) =>
    `<div class="event__type-item">
    <input id="event-type-${evType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${evType}"
    ${evType === type ? 'checked' : ''}>
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${nameCity}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${namesCityList}
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

        ${destinationContainer}
      </section>
    </form>
  </li>`
  );
}

export default class EditEventView extends AbstractStatefulView {
  #offersEvents = null;
  #destinations = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  #handleSubmitForm = null;
  #handleChangeForm = null;
  #handleDeleteClick = null;

  #inputCityName = null;
  #inputDateFrom = null;
  #inputDateTo = null;
  #inputBasePrice = null;

  constructor({event = BLANK_EVENT, offersEvents, destinations, onChangeForm, onSubmitForm, onDeleteClick}) {
    super();
    this._setState(EditEventView.parseEventToState(event));
    this.#offersEvents = offersEvents;
    this.#destinations = destinations;
    this.#handleChangeForm = onChangeForm;
    this.#handleSubmitForm = onSubmitForm;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditEventTemplate(this._state, this.#offersEvents, this.#destinations);
  }

  reset(event) {
    this.updateElement(event);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#changeFormHandler);
    this.element.querySelector('form').addEventListener('submit', this.#submitFormHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#eventTypeChangeHandler);

    const offersContainer = this.element.querySelector('.event__available-offers');
    if (offersContainer) {
      offersContainer.addEventListener('change', this.#offersChangeHandler);
    }

    this.#inputCityName = this.element.querySelector('#event-destination-1');
    this.#inputCityName.addEventListener('input', this.#cityChangeHandler);

    this.#inputDateFrom = this.element.querySelector('#event-start-time-1');
    this.#inputDateTo = this.element.querySelector('#event-end-time-1');
    this.#inputBasePrice = this.element.querySelector('#event-price-1');
    this.#setDatepickerFrom();
    this.#setDatepickerTo();

    this.element.querySelector('#event-price-1').addEventListener('input', this.#basePriceChangeHandler);
  }

  #changeFormHandler = () => this.#handleChangeForm();

  #submitFormHandler = (evt) => {
    evt.preventDefault();
    if (!this.#destinations.find((el) => this.#inputCityName.value === el.name)) {
      this.#inputCityName.style.border = 'solid 3px red';
      return;
    }

    if (!this.#inputDateFrom.value || !this.#inputDateTo.value || this.#inputBasePrice.value <= 0) {
      return;
    }

    this.#handleSubmitForm(EditEventView.parseStateToEvent(this._state));
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick();
  };

  #eventTypeChangeHandler = (evt) => {
    if (!evt.target.closest('.event__type-input')) {
      return;
    }

    evt.target.parentElement.querySelector('input').checked = true;
    this.updateElement({
      type: evt.target.closest('.event__type-input').value,
      offers: [],
    });
  };

  #offersChangeHandler = (evt) => {
    const offerId = +evt.target.closest('.event__offer-selector').dataset.offerId;
    if (!this._state.offers.includes(offerId)) {
      this._setState({offers: [...this._state.offers, offerId]});
      return;
    }

    this._setState({offers: this._state.offers.filter((el) => el !== offerId)});
  };

  #cityChangeHandler = (evt) => {
    const currentDestination = this.#destinations.find((el) => evt.target.value === el.name);
    if (!currentDestination) {
      return;
    }

    evt.target.style.border = 'none';
    this.updateElement({destination: currentDestination.id});
  };

  #basePriceChangeHandler = (evt) => {
    evt.target.value = evt.target.value.replace(PATTERN, '');
    this._setState({basePrice: +evt.target.value});
  };

  #dateChangeHandler(type, input) {
    const dateType = type;
    return ([userDate]) => {
      input.value = flatpickr.formatDate(userDate, 'd/m/y H:i');
      this._setState({[dateType]: userDate});
    };
  }

  #setDatepickerFrom() {
    this.#datepickerFrom = flatpickr(
      this.#inputDateFrom, {
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        dateFormat: 'd/m/y H:i',
        onChange: this.#dateChangeHandler('dateFrom', this.#inputDateFrom)
      }
    );
  }

  #setDatepickerTo() {
    this.#datepickerTo = flatpickr(
      this.#inputDateTo, {
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        onChange: this.#dateChangeHandler('dateTo', this.#inputDateTo)
      }
    );
  }

  static parseEventToState(event) {
    return {...event};
  }

  static parseStateToEvent(state) {
    if (!state.basePrice) {
      state.basePrice = 0;
    }
    const event = {...state};
    return event;
  }
}
