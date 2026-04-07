import { EventService } from '../services/EventService.js';

export class EventController {
  #eventService;

  constructor(eventService = new EventService()) {
    this.#eventService = eventService;
  }

  // Menggunakan standar arrow function properti untuk mempertahankan konteks 'this'
  listPublic = async (request, response) => {
    const publishedEvents = await this.#eventService.listPublished();
    return response.json(publishedEvents);
  };

  listMyEvents = async (request, response) => {
    const { user } = request;
    const userEvents = await this.#eventService.listMyEvents(user);
    return response.json(userEvents);
  };

  listAllAdmin = async (request, response) => {
    const allEvents = await this.#eventService.listAllAdmin();
    return response.json(allEvents);
  };

  getByIdOrSlug = async (request, response) => {
    const { idOrSlug } = request.params;
    const eventDetails = await this.#eventService.getEventByIdOrSlug(idOrSlug);
    return response.json(eventDetails);
  };

  create = async (request, response) => {
    const { user, body } = request;
    const newEvent = await this.#eventService.createEvent(user, body);
    return response.status(201).json(newEvent);
  };

  update = async (request, response) => {
    const { user, params, body } = request;
    const updatedEvent = await this.#eventService.updateEvent(user, params.id, body);
    return response.json(updatedEvent);
  };

  remove = async (request, response) => {
    const { user, params } = request;
    const deletionResult = await this.#eventService.deleteEvent(user, params.id);
    return response.json(deletionResult);
  };

  addDiscount = async (request, response) => {
    const { params, body } = request;
    const newDiscount = await this.#eventService.addDiscount(params.id, body);
    return response.status(201).json(newDiscount);
  };

  removeDiscount = async (request, response) => {
    const { id } = request.params;
    const removalResult = await this.#eventService.removeDiscount(id);
    return response.json(removalResult);
  };
}