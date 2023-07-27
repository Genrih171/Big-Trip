import { offersByType } from '../mock/offers';

export default class OffersModel {
  #offers = offersByType;

  get offers() {
    return this.#offers;
  }
}
