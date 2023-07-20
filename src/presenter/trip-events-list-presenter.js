import TripEventsListView from '../view/trip-events-list-view';
import TripSortView from '../view/trip-sort-view';
import EditEventView from '../view/edit-event-view';
import NewEvent from '../view/new-event-view';
import TripEvent from '../view/trip-event';
import { render } from '../render';

export default class TripEventsListPresenter {
  tripEventList = new TripEventsListView();

  constructor({eventsListContainer}) {
    this.eventsListContainer = eventsListContainer;
  }

  init() {
    render(new TripSortView(), this.eventsListContainer);
    render(this.tripEventList, this.eventsListContainer);
    render(new EditEventView(), this.tripEventList.getElement());
    render(new NewEvent(), this.tripEventList.getElement());

    for (let i = 0; i < 3; i++) {
      render(new TripEvent, this.tripEventList.getElement());
    }
  }
}
