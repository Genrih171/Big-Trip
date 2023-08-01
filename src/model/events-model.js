import { getRandomEvent } from '../mock/events';

const EVENT_COUNT = 5;

export default class EventsModel {
  #events = Array.from({length: EVENT_COUNT}, getRandomEvent);

  get events() {
    return this.#events;
  }
}
