import { isEscapeKey } from '../util';
import EventListView from '../view/event-list-view';
import EventSortView from '../view/event-sort-view';
import EditEventView from '../view/edit-event-view';
import EventView from '../view/event-view';
import EventListEmptyView from '../view/event-list-empty-view';
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
    const escKeyDownHandler = (evt) => {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const eventComponent = new EventView({
      event,
      onClick: () => {
        replaceCardToForm.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editEventComponent = new EditEventView({
      event,
      offersEvents,
      onClick: () => {
        replaceFormToCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm () {
      this.#eventListComponent.element.replaceChild(editEventComponent.element, eventComponent.element);
    }

    function replaceFormToCard () {
      this.#eventListComponent.element.replaceChild(eventComponent.element, editEventComponent.element);
    }

    render(eventComponent, this.#eventListComponent.element);
  }
}
