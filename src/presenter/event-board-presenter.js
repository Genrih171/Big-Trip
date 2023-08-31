import EventListView from '../view/event-list-view';
import EventSortView from '../view/event-sort-view';
import EventListEmptyView from '../view/event-list-empty-view';
import LoadingView from '../view/loading-view';
import EventPresenter from './event-presenter';
import { FilterTypes, SortType, UpdateType, UserAction } from '../const';
import { remove, render } from '../framework/render';
import { sortEventTime, sortEventPrice, sortEventDay } from '../utils/event';
import { filter } from '../utils/filter';
import NewEventPresenter from './new-event-presenter';

export default class EventBoardPresenter {
  #eventsModel = null;
  #filterModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #currentSortType = SortType.DAY;

  #eventBoardContainer = null;

  #sortComponent = null;
  #eventListComponent = new EventListView();
  #emptyListComponent = null;
  #loadingComponent = new LoadingView();

  #eventPresenters = new Map();
  #newEventPresenter = null;
  #onNewEventDestroy = null;

  #isLoading = true;

  constructor({eventBoardContainer, eventsModel, filterModel, offersModel, destinationsModel, onNewEventDestory}) {
    this.#eventBoardContainer = eventBoardContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#onNewEventDestroy = onNewEventDestory;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderEventBoard();
  }

  get events() {
    const filteredEvents = filter[this.#filterModel.filter]([...this.#eventsModel.events]);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredEvents.sort(sortEventTime);
      case SortType.PRICE:
        return filteredEvents.sort(sortEventPrice);
      default:
        return filteredEvents.sort(sortEventDay);
    }
  }

  get offers() {
    return this.#offersModel.offers;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  createNewEvent() {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#newEventPresenter = new NewEventPresenter({
      eventListContainer: this.#eventListComponent.element,
      offersEvents: this.offers,
      destinations: this.destinations,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#onNewEventDestroy,
    });
    this.#newEventPresenter.init();
  }

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearEventBoard();
    this.#renderEventBoard();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenters.get(update.id).setSaving();
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        this.#eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenters.get(update.id).setDeleting();
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
        this.#clearEventBoard();
        this.#renderEventBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearEventBoard({resetSortType: true});
        this.#renderEventBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderEventBoard();
        break;
    }
  };

  #renderEmtyList() {
    this.#emptyListComponent = new EventListEmptyView(this.#filterModel.filter);

    render(this.#emptyListComponent, this.#eventBoardContainer);
  }

  #renderSort() {
    this.#sortComponent = new EventSortView({
      currentSortType: this.#currentSortType,
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
    if (this.#isLoading) {
      render(this.#loadingComponent, this.#eventBoardContainer);
      return;
    }

    if (!this.events.length) {
      this.#renderEmtyList();
      return;
    }

    this.#renderSort();
    this.#renderEventList();
  }

  #clearEventBoard({resetSortType = false} = {}) {
    if (this.#newEventPresenter) {
      this.#newEventPresenter.destroy();
    }

    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }
}
