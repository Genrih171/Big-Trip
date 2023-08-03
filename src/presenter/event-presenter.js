import EventView from '../view/event-view';
import EditEventView from '../view/edit-event-view';
import { render, replace } from '../framework/render';
import { isEscapeKey } from '../util';

export default class EventPresenter {
  #eventListContainer = null;
  #event = null;
  #offersEvents = null;

  #eventComponent = null;
  #editEventComponent = null;

  constructor({eventListContainer}) {
    this.#eventListContainer = eventListContainer;
  }

  init(event, offersEvents) {
    this.#event = event;
    this.#offersEvents = offersEvents;

    this.#eventComponent = new EventView({
      event,
      onClick: this.#handleEditClick
    });

    this.#editEventComponent = new EditEventView({
      event,
      offersEvents,
      onClick: this.#handleSubmitForm
    });

    render(this.#eventComponent, this.#eventListContainer);
  }

  #replaceCardToForm() {
    replace(this.#editEventComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToCard() {
    replace(this.#eventComponent, this.#editEventComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#replaceFormToCard();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleEditClick = () => this.#replaceCardToForm();

  #handleSubmitForm = () => this.#replaceFormToCard();

}
