import { BaseModel } from './BaseModel.js'

export const orderIncludes = {
  items: {
    include: { 
      event: { 
        select: { id: true, title: true, slug: true, display_date: true, thumbnail_url: true } 
      } 
    },
  },
  user: { select: { id: true, name: true, email: true } },
  refunds: true,
}

export class OrderModel extends BaseModel {
  // Menggunakan getter untuk mengembalikan konfigurasi include secara dinamis
  get #relations() {
    return orderIncludes
  }

  create(payload) {
    return this.prisma.order.create({ 
      data: payload 
    })
  }

  createItem(payload) {
    return this.prisma.orderItem.create({ 
      data: payload 
    })
  }

  findFullById(id) {
    const numericId = BigInt(id)
    return this.prisma.order.findUnique({ 
      where: { id: numericId }, 
      include: this.#relations 
    })
  }

  listMyOrders(ownerId) {
    const formattedOwnerId = BigInt(ownerId)
    return this.prisma.order.findMany({
      where: { user_id: formattedOwnerId },
      include: this.#relations,
      orderBy: { created_at: 'desc' },
    })
  }

  listAll() {
    return this.prisma.order.findMany({ 
      include: this.#relations, 
      orderBy: { created_at: 'desc' } 
    })
  }

  listEventIdsByCreator(adminId) {
    return this.prisma.event.findMany({ 
      where: { created_by: BigInt(adminId) }, 
      select: { id: true } 
    })
  }

  listOrderIdsByEventIds(listOfEventIds) {
    return this.prisma.orderItem.findMany({
      where: { event_id: { in: listOfEventIds } },
      select: { order_id: true },
      distinct: ['order_id'],
    })
  }

  listByOrderIds(listOfOrderIds) {
    return this.prisma.order.findMany({
      where: { id: { in: listOfOrderIds } },
      include: this.#relations,
      orderBy: { created_at: 'desc' },
    })
  }

  updateStatusByParam(identifier, nextStatus) {
    const isOrderCode = identifier.startsWith('ORD-')
    
    return this.prisma.order.update({
      where: isOrderCode ? { order_code: identifier } : { id: BigInt(identifier) },
      data: { status: nextStatus },
      include: this.#relations,
    })
  }
}