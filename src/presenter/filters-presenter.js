import { render } from '../framework/render';
import EventFiltersView from '../view/event-filters-view';
import { UpdateType } from '../const';

export default class FiltersPresenter {
  #filtersContainer = null;
  #filterModel = null;

  constructor({filtersContainer, filterModel}) {
    this.#filtersContainer = filtersContainer;
    this.#filterModel = filterModel;
  }

  init() {
    render(new EventFiltersView({
      currentFilter: this.#filterModel.filter,
      onChangeFilter: this.#handleChangeFilter,
    }), this.#filtersContainer);
  }

  #handleChangeFilter = (filter) => {
    this.#filterModel.setFilter(
      UpdateType.MAJOR,
      filter
    );
  };
}
