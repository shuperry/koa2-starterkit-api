import {transaction} from '../decorators/service-decorator'

import categoryHelper from '../helpers/category-helper'

import RedisUtil from '../utils/redis-util'

class CategoryService {
  async getCategories({ctx, params}) {
    return await categoryHelper.getCategories(params)
  }

  @transaction
  async createCategory({ctx, params}) {
    const category = await categoryHelper.createCategory(params)

    RedisUtil.store(ctx.redis, 'category_', category.category_id, category)

    return category
  }

  async getCategoryById({ctx, params}) {
    const {category_id} = params

    const category = await RedisUtil.get(ctx.redis, 'category_', category_id) || await categoryHelper.getCategoryById({category_id})

    if (!!category) {
      RedisUtil.store(ctx.redis, 'category_', category.category_id, category)

      return category
    }

    return {
      flag: false,
      error_code: 'notExists'
    }
  }

  @transaction
  async updateCategory({ctx, params}) {
    const existingCategory = await categoryHelper.getCategoryById(params)

    if (!!existingCategory) {
      const category = await categoryHelper.updateCategory({
        params,
        existingCategory
      })

      RedisUtil.store(ctx.redis, 'category_', category.category_id, category)

      return category
    }

    return {
      flag: false,
      error_code: 'notExists'
    }
  }
}

export default new CategoryService()
