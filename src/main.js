import EventBoardPresenter from './presenter/event-board-presenter';
import TripInfoPresenter from './presenter/trip-info-presenter';
import EventsModel from './model/events-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';
import FiltersPresenter from './presenter/filters-presenter';
import FilterModel from './model/filter-model';

const pageHeaderContainer = document.querySelector('.trip-main');
const eventFiltersList = pageHeaderContainer.querySelector('.trip-controls__filters');
const pageBody = document.querySelector('.trip-events');

const eventsModel = new EventsModel;
const filterModel = new FilterModel;
const offersModel = new OffersModel;
const destinationsModel = new DestinationsModel;

const tripInfoPresenter = new TripInfoPresenter({
  pageHeaderContainer,
  eventsModel,
  offersModel,
  destinationsModel
});

const filtersPresenter = new FiltersPresenter({
  filtersContainer: eventFiltersList,
  filterModel,
});

const eventBoardPresenter = new EventBoardPresenter({
  eventBoardContainer: pageBody,
  eventsModel,
  filterModel,
  offersModel,
  destinationsModel
});

tripInfoPresenter.init();
filtersPresenter.init();
eventBoardPresenter.init();
