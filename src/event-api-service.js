import ApiService from './framework/api-service';

const Url = {
  POINTS: 'points',
  OFFERS: 'offers',
  DESTINATIONS: 'destinations',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class EventApiService extends ApiService {
  get events() {
    return this._load({url: Url.POINTS})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: Url.OFFERS})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: Url.DESTINATIONS})
      .then(ApiService.parseResponse);
  }

  async updateTask(event) {
    const response = await this._load({
      url: `tasks/${event.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(event) {
    const adaptedEvent = {...event,
      'base_price': event.basePrice,
      'date_from': event.dateFrom.toISOString(),
      'date_to': event.dateTo.toISOString(),
      'is_favorite': event.isFavorite,
    };

    delete adaptedEvent.basePrice;
    delete adaptedEvent.dateFrom;
    delete adaptedEvent.dateTo;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
