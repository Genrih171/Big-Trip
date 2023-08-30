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
      await this.#destinationsModel.init();
      await this.#offersModel.init();
      const events = await this.#eventApiService.events;
      this.#events = events.map(this.#adaptToClient);
    } catch {
      this.#events = [];
    }

    this._notify(UpdateType.INIT);
  }

  updateEvent(updateType, update) {
    const index = this.#events.findIndex((ev) => ev.id === update.id);

    if (index === -1) {
      throw Error('Can\'t update unexisting task');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      update,
      ...this.#events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this.#events = [
      update,
      ...this.#events
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this.#events.findIndex((ev) => ev.id === update.id);

    if (index === -1) {
      throw Error('Can\'t update unexisting task');
    }

    this.#events = [
      ...this.#events.slice(0, index),
      ...this.#events.slice(index + 1)
    ];

    this._notify(updateType);
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
