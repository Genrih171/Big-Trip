import EventFiltersView from './view/event-filters-view';
import EventBoardPresenter from './presenter/event-board-presenter';
import TripInfoPresenter from './presenter/trip-info-presenter';
import { render,} from './framework/render';
import EventsModel from './model/events-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';

const pageHeaderContainer = document.querySelector('.trip-main');
const eventFiltersList = pageHeaderContainer.querySelector('.trip-controls__filters');
const pageBody = document.querySelector('.trip-events');

const eventsModel = new EventsModel;
const offersModel = new OffersModel;
const destinationsModel = new DestinationsModel;

const tripInfoPresenter = new TripInfoPresenter({
  pageHeaderContainer,
  eventsModel,
  offersModel,
  destinationsModel
});

const eventBoardPresenter = new EventBoardPresenter({
  eventBoardContainer: pageBody,
  eventsModel,
  offersModel,
  destinationsModel
});

tripInfoPresenter.init();
render(new EventFiltersView(), eventFiltersList);
eventBoardPresenter.init();
