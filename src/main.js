import EventsFiltersView from './view/events-filters-view';
import EventsListPresenter from './presenter/events-list-presenter';
import TripInfoPresenter from './presenter/trip-info-presenter';
import { render,} from './render';
import EventsModel from './model/events-model';
import OffersModel from './model/offers-model';

const pageHeaderContainer = document.querySelector('.trip-main');
const eventsFiltersList = pageHeaderContainer.querySelector('.trip-controls__filters');
const pageBody = document.querySelector('.trip-events');

const eventsModel = new EventsModel;
const offersModel = new OffersModel;

const tripInfoPresenter = new TripInfoPresenter({
  pageHeaderContainer,
  eventsModel
});

const tripEventsListPresenter = new EventsListPresenter({
  eventsListContainer: pageBody,
  eventsModel,
  offersModel,
});

tripInfoPresenter.init();
render(new EventsFiltersView(), eventsFiltersList);
tripEventsListPresenter.init();
