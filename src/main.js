import EventBoardPresenter from './presenter/event-board-presenter';
import TripInfoPresenter from './presenter/trip-info-presenter';
import FiltersPresenter from './presenter/filters-presenter';

import EventsModel from './model/events-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';
import FilterModel from './model/filter-model';

import EventApiService from './event-api-service';

import NewEventButtonView from './view/new-event-button-view';
import { RenderPosition, render } from './framework/render';

const AUTHORIZATION = 'Basic hS2sfSGenih17144wcl1sa2j1';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip/';

const eventApiService = new EventApiService(END_POINT, AUTHORIZATION);

const pageHeaderContainer = document.querySelector('.trip-main');
const eventFiltersList = pageHeaderContainer.querySelector('.trip-controls__filters');
const pageBody = document.querySelector('.trip-events');

const filterModel = new FilterModel;
const offersModel = new OffersModel({eventApiService});
const destinationsModel = new DestinationsModel({eventApiService});
const eventsModel = new EventsModel({
  eventApiService,
  offersModel,
  destinationsModel,
});

const tripInfoPresenter = new TripInfoPresenter({
  pageHeaderContainer,
  eventsModel,
  offersModel,
  destinationsModel
});

const filtersPresenter = new FiltersPresenter({
  filtersContainer: eventFiltersList,
  eventsModel,
  filterModel,
});

const eventBoardPresenter = new EventBoardPresenter({
  eventBoardContainer: pageBody,
  eventsModel,
  filterModel,
  offersModel,
  destinationsModel,
  onNewEventDestory: handleNewEventFormClose,
});

const newEventButton = new NewEventButtonView({
  onClick: handleNewEventButtonClick
});

function handleNewEventButtonClick () {
  eventBoardPresenter.createNewEvent();
  newEventButton.element.disabled = true;
}

function handleNewEventFormClose () {
  newEventButton.element.disabled = false;
}

tripInfoPresenter.init();
filtersPresenter.init();
eventBoardPresenter.init();

(async () => {
  await offersModel.init();
  await destinationsModel.init();
  eventsModel.init()
    .finally(
      () => render(newEventButton, pageHeaderContainer, RenderPosition.BEFOREEND)
    );
})();
