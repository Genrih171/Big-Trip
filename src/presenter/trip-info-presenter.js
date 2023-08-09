import TripInfoView from '../view/trip-info-view';
import { render, RenderPosition } from '../framework/render';

export default class TripInfoPresenter {
  #pageHeaderContainer = null;
  #eventsModel = null;
  #events = [];

  constructor({pageHeaderContainer, eventsModel}) {
    this.#pageHeaderContainer = pageHeaderContainer;
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];

    render(new TripInfoView(this.#events), this.#pageHeaderContainer, RenderPosition.AFTERBEGIN);
  }
}
