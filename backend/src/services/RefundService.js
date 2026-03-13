import { ApiError } from '../utils/ApiError.js'
import { RefundModel } from '../models/RefundModel.js'

export class RefundService {
  constructor() {
    this.refundModel = new RefundModel()
  }

  formatRefund(r) {
    return {
      id: r.refund_code,
      refundId: Number(r.id),
      orderId: r.order?.order_code || String(r.order_id),
      userId: Number(r.user_id),
      reason: r.reason,
      status: r.status,
      requestedAt: r.requested_at,
      processedAt: r.processed_at,
      order: r.order
        ? {
            id: r.order.order_code,
            total: Number(r.order.total),
            status: r.order.status,
            customer: { name: r.order.customer_name, email: r.order.customer_email },
          }
        : undefined,
      user: r.user ? { id: Number(r.user.id), name: r.user.name, email: r.user.email } : undefined,
    }
  }

  async requestRefund(userId, payload) {
    const { orderId, reason } = payload
    const order = await this.refundModel.findOrderByCodeAndUser(orderId, userId)
    if (!order) throw new ApiError(404, 'Order not found')

    const existing = await this.refundModel.findByOrderId(order.id)
    if (existing) {
      return { success: false, message: 'Refund already requested for this order' }
    }

    const refund = await this.refundModel.create({
      refund_code: `REF-${Date.now()}`,
      order_id: order.id,
      user_id: BigInt(userId),
      reason: reason || null,
      status: 'pending',
    })

    return { success: true, refund: this.formatRefund(refund) }
  }

  async listRefunds(user) {
    let rows = []
    if (user.role === 'app_admin') {
      rows = await this.refundModel.listAll()
    } else if (user.role === 'event_admin') {
      const myEvents = await this.refundModel.listEventIdsByCreator(user.id)
      const eventIds = myEvents.map((e) => e.id)
      const orderIds = await this.refundModel.listOrderIdsByEventIds(eventIds)
      rows = await this.refundModel.listByOrderIds(orderIds.map((o) => o.order_id))
    } else {
      rows = await this.refundModel.listByUser(user.id)
    }
    return rows.map((r) => this.formatRefund(r))
  }

  async getRefundByOrderCode(orderCode) {
    const order = await this.refundModel.findOrderByCode(orderCode)
    if (!order) return null
    const refund = await this.refundModel.findByOrderIdWithRelations(order.id)
    return refund ? this.formatRefund(refund) : null
  }

  async processRefund(refundCode, status) {
    const refund = await this.refundModel.findByRefundCode(refundCode)
    if (!refund) throw new ApiError(404, 'Refund not found')

    const updated = await this.refundModel.updateById(refund.id, { status, processed_at: new Date() })
    if (status === 'approved') {
      await this.refundModel.updateOrderStatus(refund.order_id, 'refunded')
    }

    return this.formatRefund(updated)
  }
}
