import TripInfoView from '../view/trip-info-view';
import { render, RenderPosition } from '../framework/render';
import { sortEventDay } from '../utils/event';

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
    this.#events.sort(sortEventDay);

    render(new TripInfoView(this.#events), this.#pageHeaderContainer, RenderPosition.AFTERBEGIN);
  }
}
