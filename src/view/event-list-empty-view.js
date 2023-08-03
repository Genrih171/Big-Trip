import AbstractView from '../framework/view/abstract-view';

function createEventsListEmptyTemplate() {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}

export default class EventListEmptyView extends AbstractView {
  get template() {
    return createEventsListEmptyTemplate();
  }
}
