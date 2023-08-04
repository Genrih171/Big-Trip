import EventListView from '../view/event-list-view';
import EventSortView from '../view/event-sort-view';
import EventListEmptyView from '../view/event-list-empty-view';
import EventPresenter from './event-presenter';
import { render } from '../render';
import { updateItem } from '../util';

export default class EventBoardPresenter {
  #eventsModel = null;
  #offersModel = null;

  #events = [];
  #offers = [];

  #eventBoardContainer = null;
  #eventListComponent = new EventListView();
  #eventPresenters = new Map();

  constructor({eventBoardContainer, eventsModel, offersModel}) {
    this.#eventBoardContainer = eventBoardContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
  }

  #handleEventChange = (updateEvent, offersEvents) => {
    this.#events = updateItem(this.#events, updateEvent);
    this.#eventPresenters.get(updateEvent.id).init(updateEvent, offersEvents);
  };

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#offers = [...this.#offersModel.offers];

    this.#renderEventBoard();
  }

  #renderEmtyList() {
    render(new EventListEmptyView, this.#eventBoardContainer);
  }

  #renderSort() {
    render(new EventSortView(), this.#eventBoardContainer);
  }

  #renderEvent(event, offersEvents) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#eventListComponent.element,
      onDataChange: this.#handleEventChange
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
}
