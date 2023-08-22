import Observable from '../framework/observable';
import { getRandomEvent } from '../mock/events';

const EVENT_COUNT = 5;

export default class EventsModel extends Observable {
  #events = Array.from({length: EVENT_COUNT}, getRandomEvent);

  get events() {
    return this.#events;
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
}
