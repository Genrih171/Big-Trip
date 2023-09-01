import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { FilterTypes } from '../const';

function createEventsFiltersTemplate(state) {
  const {currentFilter, filtersAvailable} = state;

  // const getFilterButtons = () => {
  //   const filterButtons = [];

  //   for (const type in FilterTypes) {
  //     filterButtons.push(
  //       `<div class="trip-filters__filter">
  //         <input id="filter-${FilterTypes[type]}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value=${FilterTypes[type]}
  //         ${FilterTypes[type] === currentFilter ? 'checked' : ''}>
  //         <label class="trip-filters__filter-label" for="filter-${FilterTypes[type]}" data-filter="${FilterTypes[type]}">
  //         ${Array.from(FilterTypes[type])[0].toUpperCase() + FilterTypes[type].slice(1)}</label>
  //       </div>`
  //     );
  //   }

  //   return filterButtons.join('');
  // };

  const filterButtons = Object.entries(FilterTypes).map(([key, type]) =>
    `<div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value=${type}
    ${type === currentFilter ? 'checked' : ''} ${!filtersAvailable[key] ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${type}">${Array.from(type)[0].toUpperCase() + type.slice(1)}</label>
  </div>`
  ).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
    ${filterButtons}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
  );
}

export default class EventFiltersView extends AbstractStatefulView {
  #handleChangeFilter = null;

  constructor({currentFilter, onChangeFilter, filtersAvailable}) {
    super();
    this._setState({
      currentFilter: currentFilter,
      filtersAvailable: filtersAvailable});
    this.#handleChangeFilter = onChangeFilter;

    this._restoreHandlers();
  }

  get template() {
    return createEventsFiltersTemplate(this._state);
  }

  _restoreHandlers() {
    this.element.closest('.trip-filters').addEventListener('click', this.changeFilterHandler);
  }

  changeFilterHandler = (evt) => {
    if (!evt.target.closest('input')) {
      return;
    }
    this.#handleChangeFilter(evt.target.value);
  };
}
