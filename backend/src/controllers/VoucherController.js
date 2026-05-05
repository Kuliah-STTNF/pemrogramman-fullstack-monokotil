import { VoucherService } from '../services/VoucherService.js'

export class VoucherController {
  constructor(voucherService = new VoucherService()) {
    this.voucherService = voucherService
  }

  list = async ({ user }, res) => {
    const vouchers = await this.voucherService.listVouchers(user)
    return res.json(vouchers)
  }

  create = async ({ user, body }, res) => {
    const voucher = await this.voucherService.createVoucher(user, body)
    return res.status(201).json(voucher)
  }

  update = async ({ user, params, body }, res) => {
    const voucher = await this.voucherService.updateVoucher(user, params.id, body)
    return res.json(voucher)
  }

  remove = async ({ user, params }, res) => {
    const result = await this.voucherService.deleteVoucher(user, params.id)
    return res.json(result)
  }

  validate = async ({ body }, res) => {
    const result = await this.voucherService.validateVoucher(body)
    return res.json(result)
  }

  use = async ({ user, body }, res) => {
    const result = await this.voucherService.useVoucher(user.id, body)
    return res.json(result)
  }
}