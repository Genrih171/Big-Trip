import TripFiltersView from './view/trip-filters-view';
import TripEventsListPresenter from './presenter/trip-events-list-presenter';
import { render } from './render';

const tripFiltersList = document.querySelector('.trip-controls__filters');
const pageBody = document.querySelector('.trip-events');

const tripEventsListPresenter = new TripEventsListPresenter({eventsListContainer: pageBody});

render(new TripFiltersView(), tripFiltersList);
tripEventsListPresenter.init();
