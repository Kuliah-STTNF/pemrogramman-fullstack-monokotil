import { BaseModel } from './BaseModel.js'

export class VoucherModel extends BaseModel {
  list() {
    return this.prisma.voucher.findMany({ orderBy: { created_at: 'desc' } })
  }

  findByCode(code) {
    return this.prisma.voucher.findUnique({ where: { code } })
  }

  create(data) {
    return this.prisma.voucher.create({ data })
  }

  update(id, data) {
    return this.prisma.voucher.update({ where: { id: BigInt(id) }, data })
  }

  delete(id) {
    return this.prisma.voucher.delete({ where: { id: BigInt(id) } })
  }

  incrementUsage(id) {
    return this.prisma.voucher.update({
      where: { id: BigInt(id) },
      data: { used_count: { increment: 1 } },
    })
  }

  findOrderByCode(orderCode) {
    return this.prisma.order.findFirst({ where: { order_code: orderCode } })
  }

  createVoucherUsage(data) {
    return this.prisma.voucherUsage.create({ data })
  }
}
