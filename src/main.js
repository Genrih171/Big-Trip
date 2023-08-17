import EventFiltersView from './view/event-filters-view';
import EventBoardPresenter from './presenter/event-board-presenter';
import TripInfoPresenter from './presenter/trip-info-presenter';
import { render,} from './framework/render';
import EventsModel from './model/events-model';
import OffersModel from './model/offers-model';

const pageHeaderContainer = document.querySelector('.trip-main');
const eventFiltersList = pageHeaderContainer.querySelector('.trip-controls__filters');
const pageBody = document.querySelector('.trip-events');

const eventsModel = new EventsModel;
const offersModel = new OffersModel;

const tripInfoPresenter = new TripInfoPresenter({
  pageHeaderContainer,
  eventsModel
});

const eventBoardPresenter = new EventBoardPresenter({
  eventBoardContainer: pageBody,
  eventsModel,
  offersModel,
});

tripInfoPresenter.init();
render(new EventFiltersView(), eventFiltersList);
eventBoardPresenter.init();
