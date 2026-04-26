import { CategoryModel } from '../models/CategoryModel.js'

export class CategoryService {
  #model

  constructor() {
    this.#model = new CategoryModel()
  }

  transformData = ({ id, name, icon, gradient }) => ({
    id: Number(id),
    name,
    icon,
    gradient,
  })

  async listCategories() {
    const records = await this.#model.list()
    return records.map(this.transformData)
  }

  async createCategory(dataPayload) {
    const { name, icon, gradient } = dataPayload

    if (!name?.trim()) {
      const validationError = new Error('Name is required')
      validationError.status = 400
      throw validationError
    }

    const createdRecord = await this.#model.create({ name, icon, gradient })
    return this.transformData(createdRecord)
  }

  async updateCategory(categoryId, dataPayload) {
    const { name, icon, gradient } = dataPayload
    
    const updatedRecord = await this.#model.update(categoryId, { name, icon, gradient })
    return this.transformData(updatedRecord)
  }

  async deleteCategory(categoryId) {
    await this.#model.delete(categoryId)
    return { success: true }
  }
}