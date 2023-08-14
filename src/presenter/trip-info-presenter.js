import TripInfoView from '../view/trip-info-view';
import { render, RenderPosition } from '../framework/render';
import { sortEventDay } from '../utils/event';

export default class TripInfoPresenter {
  #pageHeaderContainer = null;
  #eventsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #events = [];
  #offersEvents = [];
  #destinations = [];

  constructor({pageHeaderContainer, eventsModel, offersModel, destinationsModel}) {
    this.#pageHeaderContainer = pageHeaderContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#offersEvents = [...this.#offersModel.offers];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#events.sort(sortEventDay);

    render(new TripInfoView(this.#events, this.#offersEvents, this.#destinations), this.#pageHeaderContainer, RenderPosition.AFTERBEGIN);
  }
}
