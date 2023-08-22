import Observable from '../framework/observable';
import { destinations } from '../mock/destinations';

export default class DestinationsModel extends Observable {
  #destinations = destinations;

  get destinations() {
    return this.#destinations;
  }
}
