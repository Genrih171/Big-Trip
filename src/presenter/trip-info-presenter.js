import TripInfoView from '../view/trip-info-view';
import { render, RenderPosition } from '../framework/render';
import { sortEventDay } from '../utils/event';

export default class TripInfoPresenter {
  #pageHeaderContainer = null;
  #eventsModel = null;
  #destinationsModel = null;
  #events = [];
  #destinations = [];

  constructor({pageHeaderContainer, eventsModel, destinationsModel}) {
    this.#pageHeaderContainer = pageHeaderContainer;
    this.#eventsModel = eventsModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#events.sort(sortEventDay);

    render(new TripInfoView(this.#events, this.#destinations), this.#pageHeaderContainer, RenderPosition.AFTERBEGIN);
  }
}
