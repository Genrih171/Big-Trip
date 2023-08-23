import AbstractView from '../framework/view/abstract-view';
import { FilterTypes } from '../const';

const TextTypes = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.FUTURE]: 'There are no future events now',
  [FilterTypes.PRESENT]: 'There are no present events now',
  [FilterTypes.PAST]: 'There are no past events now',
};

function createEventsListEmptyTemplate(currentFilter) {
  const currentText = TextTypes[currentFilter];
  return `<p class="trip-events__msg">${currentText}</p>`;
}

export default class EventListEmptyView extends AbstractView {
  #currentFilter = null;

  constructor(currentFilter) {
    super();
    this.#currentFilter = currentFilter;
  }

  get template() {
    return createEventsListEmptyTemplate(this.#currentFilter);
  }
}
