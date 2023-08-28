import Observable from '../framework/observable';
import { offersByType } from '../mock/offers';

export default class OffersModel extends Observable {
  #offers = offersByType;

  get offers() {
    return this.#offers;
  }
}
