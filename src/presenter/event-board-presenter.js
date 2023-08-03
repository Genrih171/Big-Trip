import EventListView from '../view/event-list-view';
import EventSortView from '../view/event-sort-view';
import EventListEmptyView from '../view/event-list-empty-view';
import EventPresenter from './event-presenter';
import { render } from '../render';

export default class EventBoardPresenter {
  #eventsModel = null;
  #offersModel = null;

  #events = [];
  #offers = [];

  #eventBoardContainer = null;
  #eventListComponent = new EventListView();

  constructor({eventBoardContainer, eventsModel, offersModel}) {
    this.#eventBoardContainer = eventBoardContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
  }

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

  #renderEvent(event, offersEvents) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#eventListComponent.element
    });
    eventPresenter.init(event, offersEvents);
  }
}
