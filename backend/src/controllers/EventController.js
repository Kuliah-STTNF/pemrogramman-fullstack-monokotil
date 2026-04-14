import { EventService } from '../services/EventService.js'

export class EventController {
  constructor(eventService = new EventService()) {
    this.eventService = eventService
  }

  listPublic = async (_req, res) => {
    const events = await this.eventService.listPublished()
    return res.json(events)
  }

  listMyEvents = async ({ user }, res) => {
    const events = await this.eventService.listMyEvents(user)
    return res.json(events)
  }

  listAllAdmin = async (_req, res) => {
    const events = await this.eventService.listAllAdmin()
    return res.json(events)
  }

  getByIdOrSlug = async ({ params }, res) => {
    const event = await this.eventService.getEventByIdOrSlug(params.idOrSlug)
    return res.json(event)
  }

  create = async ({ user, body }, res) => {
    const event = await this.eventService.createEvent(user, body)
    return res.status(201).json(event)
  }

  update = async ({ user, params, body }, res) => {
    const event = await this.eventService.updateEvent(user, params.id, body)
    return res.json(event)
  }

  remove = async ({ user, params }, res) => {
    const result = await this.eventService.deleteEvent(user, params.id)
    return res.json(result)
  }

  addDiscount = async ({ params, body }, res) => {
    const discount = await this.eventService.addDiscount(params.id, body)
    return res.status(201).json(discount)
  }

  removeDiscount = async ({ params }, res) => {
    const result = await this.eventService.removeDiscount(params.id)
    return res.json(result)
  }
}