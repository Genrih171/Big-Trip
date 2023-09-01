import { render } from '../framework/render';
import EventFiltersView from '../view/event-filters-view';
import { UpdateType, FilterTypes } from '../const';
import { filter } from '../utils/filter';
export default class FiltersPresenter {
  #filtersContainer = null;
  #filterModel = null;
  #eventsModel = null;

  #filtersComponent = null;

  #FiltersAvailable = {
    EVERYTHING: true,
    FUTURE: false,
    PRESENT: false,
    PAST: false,
  };

  constructor({filtersContainer, eventsModel, filterModel}) {
    this.#filtersContainer = filtersContainer;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;

    this.#filtersComponent = new EventFiltersView({
      currentFilter: this.#filterModel.filter,
      onChangeFilter: this.#handleChangeFilter,
      filtersAvailable: {...this.#FiltersAvailable},
    });

    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    render(this.#filtersComponent, this.#filtersContainer);
  }

  #handleModelEvent = (updateType) => {
    if (updateType !== UpdateType.PATCH) {
      this.#setFiltersAvailable(this.#eventsModel.events);

      this.#filtersComponent.updateElement({
        currentFilter: this.#filterModel.filter,
        filtersAvailable: this.#FiltersAvailable,
      });

      this.#resetFiltersAvailable();
    }
  };

  #handleChangeFilter = (filterType) => {
    this.#filterModel.setFilter(
      UpdateType.MAJOR,
      filterType
    );
  };

  #setFiltersAvailable(events) {
    if (filter[FilterTypes.FUTURE](events).length) {
      this.#FiltersAvailable.FUTURE = true;
    }
    if (filter[FilterTypes.PRESENT](events).length) {
      this.#FiltersAvailable.PRESENT = true;
    }
    if (filter[FilterTypes.PAST](events).length) {
      this.#FiltersAvailable.PAST = true;
    }
  }

  #resetFiltersAvailable() {
    this.#FiltersAvailable = {
      EVERYTHING: true,
      FUTURE: false,
      PRESENT: false,
      PAST: false,
    };
  }
}
