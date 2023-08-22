import EventListView from '../view/event-list-view';
import EventSortView from '../view/event-sort-view';
import EventListEmptyView from '../view/event-list-empty-view';
import EventPresenter from './event-presenter';
import { SortType, UpdateType, UserAction } from '../const';
import { render } from '../framework/render';
import { sortEventTime, sortEventPrice, sortEventDay } from '../utils/event';

export default class EventBoardPresenter {
  #eventsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #eventBoardContainer = null;
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #eventListComponent = new EventListView();
  #eventPresenters = new Map();

  constructor({eventBoardContainer, eventsModel, offersModel, destinationsModel}) {
    this.#eventBoardContainer = eventBoardContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderEventBoard();
  }

  get events() {
    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#eventsModel.events].sort(sortEventTime);
      case SortType.PRICE:
        return [...this.#eventsModel.events].sort(sortEventPrice);
      default:
        return [...this.#eventsModel.events].sort(sortEventDay);
    }
  }

  get offers() {
    return this.#offersModel.offers;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearEventList();
    this.#renderEventList();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        break;
      case UpdateType.MAJOR:
        break;
    }
    console.log(this.events);
  };

  #renderEmtyList() {
    render(new EventListEmptyView, this.#eventBoardContainer);
  }

  #renderSort() {
    this.#sortComponent = new EventSortView({
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#eventBoardContainer);
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      offersEvents: this.offers,
      destinations: this.destinations,
    });
    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderEventList() {
    render(this.#eventListComponent, this.#eventBoardContainer);

    this.events.forEach((ev) => this.#renderEvent(ev, this.offers, this.destinations));
  }


  #renderEventBoard() {
    if (!this.events.length) {
      this.#renderEmtyList();
      return;
    }

    this.#renderSort();
    this.#renderEventList();
  }

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }
}
