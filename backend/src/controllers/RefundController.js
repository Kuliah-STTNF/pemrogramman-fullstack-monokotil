import { RefundService } from '../services/RefundService.js'

export class RefundController {
  constructor(refundService = new RefundService()) {
    this.refundService = refundService
  }

  create = async ({ user, body }, res) => {
    const result = await this.refundService.requestRefund(user.id, body)
    return res.status(201).json(result)
  }

  list = async ({ user }, res) => {
    const refunds = await this.refundService.listRefunds(user)
    return res.json(refunds)
  }

  getByOrderId = async ({ params }, res) => {
    const refund = await this.refundService.getRefundByOrderCode(params.orderId)
    return res.json(refund)
  }

  process = async ({ user, params, body }, res) => {
    const refund = await this.refundService.processRefund(user, params.id, body.status)
    return res.json(refund)
  }
}