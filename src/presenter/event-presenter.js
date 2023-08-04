import EventView from '../view/event-view';
import EditEventView from '../view/edit-event-view';
import { remove, render, replace } from '../framework/render';
import { isEscapeKey } from '../util';

export default class EventPresenter {
  #eventListContainer = null;
  #event = null;
  #offersEvents = null;

  #eventComponent = null;
  #editEventComponent = null;

  #handleDataChange = null;

  constructor({eventListContainer, onDataChange}) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
  }

  init(event, offersEvents) {
    this.#event = event;
    this.#offersEvents = offersEvents;

    const preEventComponent = this.#eventComponent;
    const preEditEventComponent = this.#editEventComponent;

    this.#eventComponent = new EventView({
      event,
      onClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#editEventComponent = new EditEventView({
      event,
      offersEvents,
      onClick: this.#handleSubmitForm
    });

    if (preEventComponent === null || preEditEventComponent === null) {
      render(this.#eventComponent, this.#eventListContainer);
      return;
    }

    if (this.#eventListContainer.contains(preEventComponent.element)) {
      replace(this.#eventComponent, preEventComponent);
      return;
    }

    if (this.#eventListContainer.contains(preEditEventComponent.element)) {
      replace(this.#editEventComponent, preEditEventComponent);
    }

    remove(preEventComponent);
    remove(preEditEventComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#editEventComponent);
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

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#event, isFavorite: !this.#event.isFavorite}, this.#offersEvents);
  };

}
