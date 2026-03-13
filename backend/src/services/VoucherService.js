import { ApiError } from '../utils/ApiError.js'
import { VoucherModel } from '../models/VoucherModel.js'

export class VoucherService {
  constructor() {
    this.voucherModel = new VoucherModel()
  }

  formatVoucher(v) {
    return {
      id: Number(v.id),
      code: v.code,
      type: v.type,
      value: Number(v.value),
      minPurchase: Number(v.min_purchase),
      maxUses: Number(v.max_uses),
      usedCount: Number(v.used_count),
      description: v.description,
      isActive: v.is_active,
    }
  }

  async listVouchers() {
    const rows = await this.voucherModel.list()
    return rows.map((v) => this.formatVoucher(v))
  }

  async createVoucher(payload) {
    const code = (payload.code || '').trim().toUpperCase()
    if (!code) throw new ApiError(400, 'Code is required')

    const existing = await this.voucherModel.findByCode(code)
    if (existing) throw new ApiError(400, 'Voucher code already exists')

    const voucher = await this.voucherModel.create({
      code,
      type: payload.type || 'percentage',
      value: Number(payload.value) || 0,
      min_purchase: Number(payload.minPurchase) || 0,
      max_uses: Number(payload.maxUses) || 100,
      description: payload.description || '',
      is_active: true,
    })

    return this.formatVoucher(voucher)
  }

  async updateVoucher(id, payload) {
    const updateData = {}
    if (payload.type !== undefined) updateData.type = payload.type
    if (payload.value !== undefined) updateData.value = Number(payload.value)
    if (payload.minPurchase !== undefined) updateData.min_purchase = Number(payload.minPurchase)
    if (payload.maxUses !== undefined) updateData.max_uses = Number(payload.maxUses)
    if (payload.description !== undefined) updateData.description = payload.description
    if (payload.isActive !== undefined) updateData.is_active = payload.isActive
    if (payload.is_active !== undefined) updateData.is_active = payload.is_active

    const voucher = await this.voucherModel.update(id, updateData)
    return this.formatVoucher(voucher)
  }

  async deleteVoucher(id) {
    await this.voucherModel.delete(id)
    return { success: true }
  }

  async validateVoucher(payload) {
    const { code, orderTotal } = payload
    const voucher = await this.voucherModel.findByCode((code || '').toUpperCase())

    if (!voucher || !voucher.is_active) {
      return { valid: false, message: 'Invalid voucher code' }
    }
    if (voucher.used_count >= voucher.max_uses) {
      return { valid: false, message: 'Voucher has been fully redeemed' }
    }
    if (Number(orderTotal) < Number(voucher.min_purchase)) {
      return { valid: false, message: `Minimum purchase $${Number(voucher.min_purchase)} required` }
    }

    const discount = voucher.type === 'percentage'
      ? Math.round(Number(orderTotal) * Number(voucher.value) / 100 * 100) / 100
      : Math.min(Number(voucher.value), Number(orderTotal))

    return {
      valid: true,
      voucher: this.formatVoucher(voucher),
      discount,
      message: `${voucher.description} — You save $${discount.toFixed(2)}`,
    }
  }

  async useVoucher(userId, payload) {
    const { code, orderId, discountAmount } = payload
    const voucher = await this.voucherModel.findByCode((code || '').toUpperCase())
    if (!voucher) throw new ApiError(404, 'Voucher not found')

    await this.voucherModel.incrementUsage(voucher.id)

    if (orderId) {
      const order = await this.voucherModel.findOrderByCode(orderId)
      if (order) {
        await this.voucherModel.createVoucherUsage({
          voucher_id: voucher.id,
          order_id: order.id,
          user_id: BigInt(userId),
          discount_amount: discountAmount || 0,
        })
      }
    }

    return { success: true }
  }
}
