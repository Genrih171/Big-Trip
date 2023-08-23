import TripInfoView from '../view/trip-info-view';
import { remove, render, RenderPosition } from '../framework/render';
import { sortEventDay } from '../utils/event';
import { UpdateType } from '../const';

export default class TripInfoPresenter {
  #pageHeaderContainer = null;
  #eventsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #tripInfoComponent = null;

  constructor({pageHeaderContainer, eventsModel, offersModel, destinationsModel}) {
    this.#pageHeaderContainer = pageHeaderContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderTripInfo();
  }

  get events() {
    return [...this.#eventsModel.events].sort(sortEventDay);
  }

  get offers() {
    return this.#offersModel.offers;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  #renderTripInfo() {
    this.#tripInfoComponent = new TripInfoView(this.events, this.offers, this.destinations);
    render(this.#tripInfoComponent, this.#pageHeaderContainer, RenderPosition.AFTERBEGIN);
  }

  #clearTripInfo() {
    remove(this.#tripInfoComponent);
  }

  #handleModelEvent = () => {
    this.#clearTripInfo();
    this.#renderTripInfo();
  };
}
