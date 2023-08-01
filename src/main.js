import EventsFiltersView from './view/events-filters-view';
import EventsListPresenter from './presenter/events-list-presenter';
import { render } from './render';
import EventsModel from './model/events-model';
import OffersModel from './model/offers-model';

const tripFiltersList = document.querySelector('.trip-controls__filters');
const pageBody = document.querySelector('.trip-events');

const eventsModel = new EventsModel;
const offersModel = new OffersModel;
const tripEventsListPresenter = new EventsListPresenter({
  eventsListContainer: pageBody,
  eventsModel,
  offersModel,
});

render(new EventsFiltersView(), tripFiltersList);
tripEventsListPresenter.init();
