import Observable from '../framework/observable';
import { UpdateType } from '../const';

export default class EventsModel extends Observable {
  #eventApiService = null;
  #events = [];

  #offersModel = null;
  #destinationsModel = null;

  constructor({eventApiService, offersModel, destinationsModel}) {
    super();
    this.#eventApiService = eventApiService;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  get events() {
    return this.#events;
  }

  async init() {
    try {
      const events = await this.#eventApiService.events;
      this.#events = events.map(this.#adaptToClient);
    } catch {
      this.#events = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updateEvent(updateType, update) {
    const index = this.#events.findIndex((ev) => ev.id === update.id);

    if (index === -1) {
      throw Error('Can\'t update unexisting event');
    }

    try {
      const response = await this.#eventApiService.updateEvent(update);
      const updatedEvent = this.#adaptToClient(response);
      this.#events = [
        ...this.#events.slice(0, index),
        updatedEvent,
        ...this.#events.slice(index + 1)
      ];
      this._notify(updateType, update);
    } catch {
      throw Error('Can\'t update event');
    }
  }

  async addEvent(updateType, update) {
    try {
      const response = await this.#eventApiService.addEvent(update);
      const addedEvent = this.#adaptToClient(response);
      this.#events = [
        addedEvent,
        ...this.#events
      ];
      this._notify(updateType, update);
    } catch {
      throw Error('Can\'t add event');
    }
  }

  async deleteEvent(updateType, event) {
    const index = this.#events.findIndex((ev) => ev.id === event.id);

    if (index === -1) {
      throw Error('Can\'t delete unexisting event');
    }

    try {
      await this.#eventApiService.deleteEvent(event);
      this.#events = [
        ...this.#events.slice(0, index),
        ...this.#events.slice(index + 1)
      ];
      this._notify(updateType);
    } catch {
      throw Error('Can\'t delete event');
    }
  }

  #adaptToClient(event) {
    const adaptedEvent = {...event,
      basePrice: event['base_price'],
      dateFrom: event['date_from'],
      dateTo: event['date_to'],
      isFavorite: event['is_favorite'],
    };

    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  }
}
