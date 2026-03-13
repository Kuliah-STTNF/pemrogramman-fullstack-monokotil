import { BaseModel } from './BaseModel.js'

const includeRelation = {
  order: true,
  user: { select: { id: true, name: true, email: true } },
}

export class RefundModel extends BaseModel {
  findOrderByCodeAndUser(orderCode, userId) {
    return this.prisma.order.findFirst({ where: { order_code: orderCode, user_id: BigInt(userId) } })
  }

  findByOrderId(orderId) {
    return this.prisma.refund.findFirst({ where: { order_id: BigInt(orderId) } })
  }

  create(data) {
    return this.prisma.refund.create({ data, include: includeRelation })
  }

  listAll() {
    return this.prisma.refund.findMany({ include: includeRelation, orderBy: { requested_at: 'desc' } })
  }

  listEventIdsByCreator(userId) {
    return this.prisma.event.findMany({ where: { created_by: BigInt(userId) }, select: { id: true } })
  }

  listOrderIdsByEventIds(eventIds) {
    return this.prisma.orderItem.findMany({
      where: { event_id: { in: eventIds } },
      select: { order_id: true },
      distinct: ['order_id'],
    })
  }

  listByOrderIds(orderIds) {
    return this.prisma.refund.findMany({
      where: { order_id: { in: orderIds } },
      include: includeRelation,
      orderBy: { requested_at: 'desc' },
    })
  }

  listByUser(userId) {
    return this.prisma.refund.findMany({
      where: { user_id: BigInt(userId) },
      include: includeRelation,
      orderBy: { requested_at: 'desc' },
    })
  }

  findOrderByCode(orderCode) {
    return this.prisma.order.findFirst({ where: { order_code: orderCode } })
  }

  findByOrderIdWithRelations(orderId) {
    return this.prisma.refund.findFirst({ where: { order_id: BigInt(orderId) }, include: includeRelation })
  }

  findByRefundCode(refundCode) {
    return this.prisma.refund.findFirst({ where: { refund_code: refundCode } })
  }

  updateById(id, data) {
    return this.prisma.refund.update({ where: { id: BigInt(id) }, data, include: includeRelation })
  }

  updateOrderStatus(orderId, status) {
    return this.prisma.order.update({ where: { id: BigInt(orderId) }, data: { status } })
  }
}
