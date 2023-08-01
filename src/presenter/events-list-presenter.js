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
    const eventComponent = new EventView({event});
    const editEventComponent = new EditEventView({event, offersEvents});

    const replaceCardToForm = () => this.#eventsListComponent.element.replaceChild(editEventComponent.element, eventComponent.element);

    const replaceFormToCard = () => this.#eventsListComponent.element.replaceChild(eventComponent.element, editEventComponent.element);

    const escKeyDownHandler = (evt) => {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    eventComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    editEventComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    });
    editEventComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(eventComponent, this.#eventsListComponent.element);
  }
}
