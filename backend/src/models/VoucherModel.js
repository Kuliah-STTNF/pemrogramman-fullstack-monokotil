import { BaseModel } from './BaseModel.js'

export class VoucherModel extends BaseModel {
  // Enkapsulasi kriteria relasi data event ke dalam private field
  #eventRelationConfig = {
    event: {
      select: { id: true, title: true, created_by: true }
    }
  }

  list() {
    return this.prisma.voucher.findMany({
      include: this.#eventRelationConfig,
      orderBy: { created_at: 'desc' },
    })
  }

  listByCreator(adminUserId) {
    const formattedAdminId = BigInt(adminUserId)
    
    return this.prisma.voucher.findMany({
      where: { 
        event: { created_by: formattedAdminId } 
      },
      include: this.#eventRelationConfig,
      orderBy: { created_at: 'desc' },
    })
  }

  findByCode(voucherCode) {
    return this.prisma.voucher.findUnique({
      where: { code: voucherCode },
      include: this.#eventRelationConfig,
    })
  }

  findById(voucherId) {
    return this.prisma.voucher.findUnique({
      where: { id: BigInt(voucherId) },
      include: this.#eventRelationConfig,
    })
  }

  findEventById(targetEventId) {
    const numericEventId = BigInt(targetEventId)
    return this.prisma.event.findUnique({ 
      where: { id: numericEventId } 
    })
  }

  findEventByIdAndCreator(targetEventId, adminUserId) {
    return this.prisma.event.findFirst({
      where: { 
        id: BigInt(targetEventId), 
        created_by: BigInt(adminUserId) 
      },
    })
  }

  create(payloadData) {
    return this.prisma.voucher.create({ 
      data: payloadData 
    })
  }

  update(voucherId, payloadData) {
    return this.prisma.voucher.update({ 
      where: { id: BigInt(voucherId) }, 
      data: payloadData 
    })
  }

  delete(voucherId) {
    return this.prisma.voucher.delete({ 
      where: { id: BigInt(voucherId) } 
    })
  }

  incrementUsage(voucherId) {
    const numericVoucherId = BigInt(voucherId)
    
    return this.prisma.voucher.update({
      where: { id: numericVoucherId },
      data: { 
        used_count: { increment: 1 } 
      },
    })
  }

  findOrderByCode(targetOrderCode) {
    return this.prisma.order.findFirst({ 
      where: { order_code: targetOrderCode } 
    })
  }

  createVoucherUsage(usagePayload) {
    return this.prisma.voucherUsage.create({ 
      data: usagePayload 
    })
  }
}