import Observable from '../framework/observable';

export default class OffersModel extends Observable {
  #eventApiService = null;
  #offers = null;

  constructor({eventApiService}) {
    super();
    this.#eventApiService = eventApiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const offers = await this.#eventApiService.offers;
      this.#offers = offers;
    } catch {
      throw Error('Can\'t download offers!');
    }
  }
}
