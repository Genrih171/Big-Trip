import TripEventsListView from '../view/trip-events-list-view';
import TripSortView from '../view/trip-sort-view';
import EditEventView from '../view/edit-event-view';
import EventView from '../view/event-view';
import { render } from '../render';

export default class TripEventsListPresenter {
  tripEventList = new TripEventsListView();

  constructor({eventsListContainer, eventsModel, offersModel}) {
    this.eventsListContainer = eventsListContainer;
    this.eventsModel = eventsModel;
    this.offersModel = offersModel;
  }

  init() {
    this.events = [...this.eventsModel.getEvents()];
    this.offers = [...this.offersModel.getOffers()];

    render(new TripSortView(), this.eventsListContainer);
    render(this.tripEventList, this.eventsListContainer);
    render(new EditEventView(this.events[0], this.offers), this.tripEventList.getElement());
    render(new EditEventView(), this.tripEventList.getElement());

    for (let i = 1; i < this.events.length; i++) {
      render(new EventView({event: this.events[i]}), this.tripEventList.getElement());
    }
  }
}
