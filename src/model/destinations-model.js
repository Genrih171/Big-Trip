import Observable from '../framework/observable';

export default class DestinationsModel extends Observable {
  #eventApiService = null;
  #destinations = null;

  constructor({eventApiService}) {
    super();
    this.#eventApiService = eventApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      const destinations = await this.#eventApiService.destinations;
      this.#destinations = destinations;
    } catch {
      throw Error('Can\'t download destinations!');
    }
  }
}
