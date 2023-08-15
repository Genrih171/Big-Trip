import EventView from '../view/event-view';
import EditEventView from '../view/edit-event-view';
import { remove, render, replace } from '../framework/render';
import { isEscapeKey } from '../utils/common';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};
export default class EventPresenter {
  #eventListContainer = null;
  #event = null;
  #offersEvents = null;
  #destinations = null;

  #eventComponent = null;
  #editEventComponent = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #mode = Mode.DEFAULT;

  constructor({eventListContainer, onDataChange, onModeChange}) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(event, offersEvents, destinations) {
    this.#event = event;
    this.#offersEvents = offersEvents;
    this.#destinations = destinations;

    const preEventComponent = this.#eventComponent;
    const preEditEventComponent = this.#editEventComponent;

    this.#eventComponent = new EventView({
      event: this.#event,
      offersEvents: this.#offersEvents,
      destinations: this.#destinations,
      onClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#editEventComponent = new EditEventView({
      event: this.#event,
      offersEvents: this.#offersEvents,
      destinations: this.#destinations,
      onChangeForm: this.#handleChangeForm,
      onSubmitForm: this.#handleSubmitForm,
    });

    if (preEventComponent === null || preEditEventComponent === null) {
      render(this.#eventComponent, this.#eventListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, preEventComponent);
      return;
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editEventComponent, preEditEventComponent);
    }

    remove(preEventComponent);
    remove(preEditEventComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#editEventComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editEventComponent.reset(this.#event);
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    replace(this.#editEventComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#eventComponent, this.#editEventComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#editEventComponent.reset(this.#event);
      this.#replaceFormToCard();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleEditClick = () => this.#replaceCardToForm();

  #handleChangeForm = () => {
    this.#editEventComponent.reset(this.#event);
    this.#replaceFormToCard();
  };

  #handleSubmitForm = () => this.#replaceFormToCard();

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#event, isFavorite: !this.#event.isFavorite}, this.#offersEvents, this.#destinations);
  };

}
