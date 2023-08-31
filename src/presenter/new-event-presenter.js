import { RenderPosition, remove, render } from '../framework/render';
import EditEventView from '../view/edit-event-view';
import { isEscapeKey } from '../utils/common';
import { UserAction, UpdateType } from '../const';

export default class NewEventPresenter {
  #eventListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #offersEvents = null;
  #destinations = null;

  #editEventComponent = null;

  constructor({eventListContainer, offersEvents, destinations, onDataChange, onDestroy}) {
    this.#eventListContainer = eventListContainer;
    this.#offersEvents = offersEvents;
    this.#destinations = destinations;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    this.#editEventComponent = new EditEventView({
      offersEvents: this.#offersEvents,
      destinations: this.#destinations,
      onChangeForm: this.#handleDeleteClick,
      onSubmitForm: this.#handleSubmitForm,
      onDeleteClick: this.#handleDeleteClick,
    });

    render(this.#editEventComponent, this.#eventListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#editEventComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
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
    if (this.#editEventComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#editEventComponent);
    this.#editEventComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleSubmitForm = (update) => {
    this.#handleDataChange(
      UserAction.ADD_EVENT,
      UpdateType.MINOR,
      update,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
