import { ApiError } from '../utils/ApiError.js'
import { CategoryModel } from '../models/CategoryModel.js'
import { EventModel } from '../models/EventModel.js'

export class EventService {
  constructor() {
    this.eventModel = new EventModel()
    this.categoryModel = new CategoryModel()
  }

  formatEvent(e) {
    return {
      id: Number(e.id),
      title: e.title,
      slug: e.slug,
      date: e.display_date,
      fullDate: e.full_date,
      time: e.time_range,
      venue: e.venue,
      city: e.city,
      province: e.province,
      address: e.address,
      lat: e.latitude ? Number(e.latitude) : null,
      lng: e.longitude ? Number(e.longitude) : null,
      category: e.category?.name || null,
      categoryId: e.category_id ? Number(e.category_id) : null,
      image: e.image_url,
      thumbnail: e.thumbnail_url,
      description: e.description,
      artist: e.artist,
      organizer: e.organizer,
      status: e.status,
      hasMerch: e.has_merch,
      createdBy: e.created_by ? Number(e.created_by) : null,
      createdAt: e.created_at,
      updatedAt: e.updated_at,
      tags: e.event_tags?.map((et) => et.tag.name) || [],
      tickets: e.ticket_types?.map((t) => ({
        id: Number(t.id),
        type: t.type_name,
        price: Number(t.price),
        description: t.description,
        available: t.available,
      })) || [],
      merchandise: e.merchandise?.map((m) => ({
        id: Number(m.id),
        name: m.name,
        price: Number(m.price),
        image: m.image_url,
        sizes: m.sizes?.map((s) => s.size_name) || [],
        colors: m.colors?.map((c) => c.color_name) || [],
        stock: m.stock,
      })) || [],
      discount: e.discounts?.[0]
        ? { percentage: Number(e.discounts[0].percentage), label: e.discounts[0].label }
        : null,
    }
  }

  async resolveCategoryId(data, fallbackCategoryId = null) {
    let categoryId = data.categoryId || data.category_id || fallbackCategoryId || null
    if (!categoryId && data.category) {
      const cat = await this.categoryModel.findByName(data.category)
      if (cat) categoryId = cat.id
    }
    return categoryId
  }

  normalizeEventPayload(data, userId, existing = null, categoryId = null) {
    return {
      title: data.title ?? existing?.title,
      slug:
        data.slug ??
        existing?.slug ??
        (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : null),
      display_date: data.date ?? data.display_date ?? existing?.display_date ?? null,
      full_date: data.fullDate || data.full_date ? new Date(data.fullDate || data.full_date) : existing?.full_date ?? null,
      time_range: data.time ?? data.time_range ?? existing?.time_range ?? null,
      venue: data.venue ?? existing?.venue,
      city: data.city ?? existing?.city,
      province: data.province ?? existing?.province ?? null,
      address: data.address ?? existing?.address ?? null,
      latitude: data.lat ?? data.latitude ?? existing?.latitude ?? null,
      longitude: data.lng ?? data.longitude ?? existing?.longitude ?? null,
      category_id: categoryId ? BigInt(categoryId) : null,
      image_url: data.image ?? data.image_url ?? existing?.image_url ?? null,
      thumbnail_url: data.thumbnail ?? data.thumbnail_url ?? existing?.thumbnail_url ?? null,
      description: data.description ?? existing?.description ?? null,
      artist: data.artist ?? existing?.artist ?? null,
      organizer: data.organizer ?? existing?.organizer ?? null,
      status: data.status ?? existing?.status ?? 'published',
      has_merch: data.hasMerch ?? data.has_merch ?? existing?.has_merch ?? false,
      created_by: existing?.created_by ?? BigInt(userId),
    }
  }

 async syncTags(targetEventId, tagList) {
    if (!tagList) return
    
    await this.eventModel.clearEventTags(targetEventId)
    
    // Menggunakan Promise.all untuk eksekusi asinkronus paralel yang lebih efisien
    await Promise.all(
      tagList.map(async (nameOfTag) => {
        const registeredTag = await this.eventModel.upsertTag(nameOfTag)
        return this.eventModel.addEventTag(targetEventId, registeredTag.id)
      })
    )
  }

  async syncTickets(targetEventId, ticketDataList) {
    if (!ticketDataList?.length) return
    
    await this.eventModel.clearTicketTypes(targetEventId)
    
    const formattedTickets = ticketDataList.map((ticketItem) => ({
      event_id: BigInt(targetEventId),
      type_name: ticketItem.type ?? ticketItem.type_name,
      price: ticketItem.price,
      description: ticketItem.description ?? null,
      available: ticketItem.available ?? 0,
    }))

    await this.eventModel.createTicketTypes(formattedTickets)
  }

  async syncMerchandise(targetEventId, merchandiseList) {
    if (!merchandiseList) return
    
    await this.eventModel.clearMerchandise(targetEventId)
    
    // Menggunakan perulangan for...of modern untuk sekuensial data creation yang aman
    for (const item of merchandiseList) {
      const createdMerch = await this.eventModel.createMerchandise({
        event_id: BigInt(targetEventId),
        name: item.name,
        price: item.price,
        image_url: item.image ?? item.image_url ?? null,
        stock: item.stock ?? 0,
      })

      if (item.sizes?.length) {
        const mappedSizes = item.sizes.map((size) => ({ 
          merch_id: createdMerch.id, 
          size_name: size 
        }))
        await this.eventModel.createMerchandiseSizes(mappedSizes)
      }

      if (item.colors?.length) {
        const mappedColors = item.colors.map((color) => ({ 
          merch_id: createdMerch.id, 
          color_name: color 
        }))
        await this.eventModel.createMerchandiseColors(mappedColors)
      }
    }
  }

  async listPublished() {
    const rows = await this.eventModel.listPublished()
    return rows.map((e) => this.formatEvent(e))
  }

  async listMyEvents(user) {
    const rows = await this.eventModel.listForAdmin(user.id, user.role)
    return rows.map((e) => this.formatEvent(e))
  }

  async listAllAdmin() {
    const rows = await this.eventModel.listAllForAppAdmin()
    return rows.map((e) => this.formatEvent(e))
  }

  async getEventByIdOrSlug(idOrSlug) {
    const event = await this.eventModel.findByIdOrSlug(idOrSlug)
    if (!event) throw new ApiError(404, 'Event not found')
    return this.formatEvent(event)
  }

  async createEvent(user, payload) {
    const categoryId = await this.resolveCategoryId(payload)
    const created = await this.eventModel.create(this.normalizeEventPayload(payload, user.id, null, categoryId))

    await this.syncTags(created.id, payload.tags)
    await this.syncTickets(created.id, payload.tickets)
    await this.syncMerchandise(created.id, payload.merchandise)

    if (payload.discount) {
      await this.eventModel.createDiscount({
        event_id: created.id,
        percentage: payload.discount.percentage,
        label: payload.discount.label || null,
        is_active: true,
      })
    }

    const full = await this.eventModel.findFullById(created.id)
    return this.formatEvent(full)
  }

  async updateEvent(user, eventId, payload) {
    const existing = await this.eventModel.findById(eventId)
    if (!existing) throw new ApiError(404, 'Event not found')
    if (user.role === 'event_admin' && Number(existing.created_by) !== user.id) {
      throw new ApiError(403, 'Access denied')
    }

    const categoryId = await this.resolveCategoryId(payload, existing.category_id)
    await this.eventModel.update(eventId, this.normalizeEventPayload(payload, user.id, existing, categoryId))

    await this.syncTags(eventId, payload.tags)
    await this.syncTickets(eventId, payload.tickets)
    await this.syncMerchandise(eventId, payload.merchandise)

    const full = await this.eventModel.findFullById(eventId)
    return this.formatEvent(full)
  }

  async deleteEvent(user, eventId) {
    const existing = await this.eventModel.findById(eventId)
    if (!existing) throw new ApiError(404, 'Event not found')
    if (user.role === 'event_admin' && Number(existing.created_by) !== user.id) {
      throw new ApiError(403, 'Access denied')
    }
    await this.eventModel.delete(eventId)
    return { success: true }
  }

  async addDiscount(eventId, payload) {
    await this.eventModel.deactivateDiscounts(eventId)
    return this.eventModel.createDiscount({
      event_id: BigInt(eventId),
      percentage: payload.percentage,
      label: payload.label || null,
      is_active: true,
    })
  }

  async removeDiscount(eventId) {
    await this.eventModel.deactivateDiscounts(eventId)
    return { success: true }
  }
}
