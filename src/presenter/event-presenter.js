import EventView from '../view/event-view';
import EditEventView from '../view/edit-event-view';
import { remove, render, replace } from '../framework/render';
import { isEscapeKey } from '../utils/common';
import { isDateEqual } from '../utils/event';
import { UpdateType, UserAction } from '../const';

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

  constructor({eventListContainer, onDataChange, onModeChange, offersEvents, destinations}) {
    this.#eventListContainer = eventListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#offersEvents = offersEvents;
    this.#destinations = destinations;
  }

  init(event) {
    this.#event = event;

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
      onDeleteClick: this.#handleDeleteClick,
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
      replace(this.#eventComponent, preEditEventComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(preEventComponent);
    remove(preEditEventComponent);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editEventComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editEventComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#eventComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editEventComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editEventComponent.shake(resetFormState);
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

  #handleSubmitForm = (update) => {
    const isMinorUpdate = !isDateEqual(this.#event.dateFrom, update.dateFrom) || !isDateEqual(this.#event.dateTo, update.dateTo) ||
    this.#event.basePrice !== update.basePrice;

    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_EVENT,
      UpdateType.PATCH,
      {...this.#event, isFavorite: !this.#event.isFavorite},
    );
  };

  #handleDeleteClick = () => {
    this.#handleDataChange(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      {...this.#event},
    );
  };

}
