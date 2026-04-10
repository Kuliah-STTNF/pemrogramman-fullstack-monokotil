import { BaseModel } from './BaseModel.js'

// Konfigurasi seleksi data relasi yang diekstrak secara terpisah
const EVENT_SELECT_FIELDS = { id: true, title: true, slug: true, display_date: true, thumbnail_url: true }
const USER_SELECT_FIELDS = { id: true, name: true, email: true }

export const orderIncludes = {
  items: {
    include: { event: { select: EVENT_SELECT_FIELDS } },
  },
  user: { select: USER_SELECT_FIELDS },
  refunds: true,
}

export class OrderModel extends BaseModel {
  // Menyimpan relasi bawaan di dalam properti kelas
  #defaultIncludes = orderIncludes

  create(orderData) {
    return this.prisma.order.create({ data: orderData })
  }

  createItem(itemData) {
    return this.prisma.orderItem.create({ data: itemData })
  }

  findFullById(orderId) {
    return this.prisma.order.findUnique({ 
      where: { id: BigInt(orderId) }, 
      include: this.#defaultIncludes 
    })
  }

  listMyOrders(userId) {
    return this.prisma.order.findMany({
      where: { user_id: BigInt(userId) },
      include: this.#defaultIncludes,
      orderBy: { created_at: 'desc' },
    })
  }

  listAll() {
    return this.prisma.order.findMany({ 
      include: this.#defaultIncludes, 
      orderBy: { created_at: 'desc' } 
    })
  }

  listEventIdsByCreator(creatorId) {
    return this.prisma.event.findMany({ 
      where: { created_by: BigInt(creatorId) }, 
      select: { id: true } 
    })
  }

  listOrderIdsByEventIds(targetEventIds) {
    return this.prisma.orderItem.findMany({
      where: { event_id: { in: targetEventIds } },
      select: { order_id: true },
      distinct: ['order_id'],
    })
  }

  listByOrderIds(targetOrderIds) {
    return this.prisma.order.findMany({
      where: { id: { in: targetOrderIds } },
      include: this.#defaultIncludes,
      orderBy: { created_at: 'desc' },
    })
  }

  updateStatusByParam(searchParam, targetStatus) {
    const queryCondition = searchParam.startsWith('ORD-')
      ? { order_code: searchParam }
      : { id: BigInt(searchParam) }

    return this.prisma.order.update({
      where: queryCondition,
      data: { status: targetStatus },
      include: this.#defaultIncludes,
    })
  }
}