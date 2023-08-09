import EventListView from '../view/event-list-view';
import EventSortView from '../view/event-sort-view';
import EventListEmptyView from '../view/event-list-empty-view';
import EventPresenter from './event-presenter';
import { SortType } from '../const';
import { render } from '../framework/render';
import { updateItem} from '../utils/common';
import { sortEventTime, sortEventPrice } from '../utils/event';

export default class EventBoardPresenter {
  #eventsModel = null;
  #offersModel = null;

  #events = [];
  #sourceEvents = [];
  #offers = [];

  #eventBoardContainer = null;
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #eventListComponent = new EventListView();
  #eventPresenters = new Map();

  constructor({eventBoardContainer, eventsModel, offersModel}) {
    this.#eventBoardContainer = eventBoardContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
  }

  #handleEventChange = (updateEvent, offersEvents) => {
    this.#events = updateItem(this.#events, updateEvent);
    this.#sourceEvents = updateItem(this.#sourceEvents, updateEvent);
    this.#eventPresenters.get(updateEvent.id).init(updateEvent, offersEvents);
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortEvent(sortType);
    this.#clearEventList();
    this.#renderEventList();
  };

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#sourceEvents = [...this.#eventsModel.events];
    this.#offers = [...this.#offersModel.offers];

    this.#renderEventBoard();
  }

  #renderEmtyList() {
    render(new EventListEmptyView, this.#eventBoardContainer);
  }

  #renderSort() {
    this.#sortComponent = new EventSortView({
      onSortTypeChange: this.#handleSortTypeChange
    });
    render(this.#sortComponent, this.#eventBoardContainer);
  }

  #sortEvent(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#events.sort(sortEventTime);
        break;
      case SortType.PRICE:
        this.#events.sort(sortEventPrice);
        break;
      default:
        this.#events = [...this.#sourceEvents];
    }

    this.#currentSortType = sortType;
  }

  #renderEvent(event, offersEvents) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange
    });
    eventPresenter.init(event, offersEvents);
    this.#eventPresenters.set(event.id, eventPresenter);
  }

  #renderEventList() {
    render(this.#eventListComponent, this.#eventBoardContainer);

    this.#events.forEach((ev) => this.#renderEvent(ev, this.#offers));
  }


  #renderEventBoard() {
    if (!this.#events.length) {
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
