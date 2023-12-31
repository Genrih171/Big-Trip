import AbstractView from '../framework/view/abstract-view';

const createTemplateButtonNewEvent = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class NewEventButtonView extends AbstractView {
  #handleButtonClick = null;

  constructor({onClick}) {
    super();
    this.#handleButtonClick = onClick;

    this.element.addEventListener('click', this.#buttonClickHandler);
  }

  get template() {
    return createTemplateButtonNewEvent();
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleButtonClick();
  };
}
