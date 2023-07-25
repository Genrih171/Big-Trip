import { offersByType } from '../mock/offers';

export default class OffersModel {
  offers = offersByType;

  getOffers() {
    return this.offers;
  }
}
