import AbstractView from '../framework/view/abstract-view';
import { FilterTypes } from '../const';

function createEventsFiltersTemplate(currentFilter) {
  const filterButtons = Object.values(FilterTypes).map((type) =>
    `<div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value=${type}
    ${type === currentFilter ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${type}" data-filter="${type}">${Array.from(type)[0].toUpperCase() + type.slice(1)}</label>
  </div>`
  ).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
    ${filterButtons}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
  );
}

export default class EventFiltersView extends AbstractView {
  #currentFilter = null;
  #handleChangeFilter = null;

  constructor({currentFilter, onChangeFilter}) {
    super();
    this.#currentFilter = currentFilter;
    this.#handleChangeFilter = onChangeFilter;

    this.element.closest('.trip-filters').addEventListener('click', this.changeFilterHandler);
  }

  get template() {
    return createEventsFiltersTemplate(this.#currentFilter);
  }

  changeFilterHandler = (evt) => {
    if (!evt.target.closest('.trip-filters__filter-label')) {
      return;
    }
    this.#handleChangeFilter(evt.target.dataset.filter);
  };
}
