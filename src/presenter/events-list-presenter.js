import { isEscapeKey } from '../util';
import EventsListView from '../view/events-list-view';
import EventsSortView from '../view/events-sort-view';
import EditEventView from '../view/edit-event-view';
import EventView from '../view/event-view';
import EventsListEmptyView from '../view/events-list-empty-view';
import { render } from '../render';

export default class EventsListPresenter {
  #eventsListContainer = null;
  #eventsModel = null;
  #offersModel = null;
  #events = [];
  #offers = [];

  #eventsListComponent = new EventsListView();

  constructor({eventsListContainer, eventsModel, offersModel}) {
    this.#eventsListContainer = eventsListContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#events = [...this.#eventsModel.events];
    this.#offers = [...this.#offersModel.offers];

    if (!this.#events.length) {
      render(new EventsListEmptyView, this.#eventsListContainer);
    } else {
      render(new EventsSortView(), this.#eventsListContainer);
      render(this.#eventsListComponent, this.#eventsListContainer);

      for (let i = 0; i < this.#events.length; i++) {
        this.#renderEvent(this.#events[i], this.#offers);
      }
    }
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
      this.#eventsListComponent.element.replaceChild(editEventComponent.element, eventComponent.element);
    }

    function replaceFormToCard () {
      this.#eventsListComponent.element.replaceChild(eventComponent.element, editEventComponent.element);
    }

    render(eventComponent, this.#eventsListComponent.element);
  }
}
