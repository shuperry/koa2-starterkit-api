import _ from 'lodash'

class CategoryHelper {
  async getCategories({name, code, parent_id, category_id, keyText}) {
    const {models} = g_api

    let categories
    if (!_.isUndefined(parent_id)) {
      categories = await models.Category.find({
        where: {
          category_id: parent_id
        },
        include: [
          {
            model: models.Category,
            as: 'descendents',
            hierarchy: true
          }
        ],
        order: [
          [
            {
              model: models.Category,
              as: 'descendents'
            },
            'rank',
            'ASC'
          ]
        ]
      })
    } else if (!_.isUndefined(category_id)) {
      categories = await models.Category.find({
        where: {
          category_id
        },
        include: [
          {
            model: models.Category,
            as: 'descendents',
            hierarchy: true
          }
        ],
        order: [
          [
            {
              model: models.Category,
              as: 'descendents'
            },
            'rank',
            'ASC'
          ]
        ]
      })
    } else if (!_.isUndefined(code)) {
      categories = await models.Category.find({
        where: {
          code
        },
        include: [
          {
            model: models.Category,
            as: 'descendents',
            hierarchy: true
          }
        ],
        order: [
          [
            {
              model: models.Category,
              as: 'descendents'
            },
            'rank',
            'ASC'
          ]
        ]
      })
    } else if (!_.isUndefined(name) || !_.isUndefined(keyText)) {
      const where = {}

      if (!_.isUndefined(name)) where['name'] = {$like: `%${name}%`}

      if (!_.isUndefined(keyText)) {
        where['$or'] = [
          {
            name: {$like: `%${keyText}%`}
          },
          {
            code: {$like: `%${keyText}%`}
          }
        ]
      }

      categories = await models.Category.findAll({
        where,
        include: [
          {
            model: models.Category,
            as: 'descendents',
            hierarchy: true
          }
        ],
        order: [
          [
            'rank',
            'ASC'
          ],
          [
            {
              model: models.Category,
              as: 'descendents'
            },
            'rank',
            'ASC'
          ]
        ]
      })
    } else {
      categories = await models.Category.findAll({
        hierarchy: true,
        order: [
          [
            'rank',
            'ASC'
          ]
        ]
      })
    }

    return categories
  }

  async getSimpleCategories(params) {
    const {models} = g_api

    const {code, parent_id, level, category_id} = params

    const where = {}

    if (!_.isUndefined(code)) where['code'] = code
    if (!_.isUndefined(parent_id)) where['parent_id'] = parent_id
    if (!_.isUndefined(level)) where['level'] = level
    if (!_.isUndefined(category_id)) where['category_id'] = category_id

    return await models.Category.findAll({
      where
    })
  }

  async getCategoryById({category_id}) {
    const {models} = g_api

    const where = {category_id}

    return await models.Category.find({
      where,
      include: [
        {
          model: models.Category,
          as: 'descendents',
          hierarchy: true
        },
        {
          model: models.Category,
          as: 'parent'
        }
      ],
      order: [
        [
          {
            model: models.Category,
            as: 'descendents'
          },
          'rank',
          'ASC'
        ]
      ]
    })
  }

  async getCategoryByCode({code}) {
    const {models} = g_api

    const where = {code}

    return await models.Category.find({
      where
    })
  }

  async createCategory(params) {
    const {models} = g_api

    const category = await models.Category.create(params)

    // if (1 === 1) {
    //   throw new Error('into throw new error, testing transaction.')
    // }

    return getCategoryById({category_id: category.category_id})
  }

  async updateCategory({params, existingCategory}) {
    const category = await existingCategory.update(params, {fields: existingCategory.attributes})

    return await getCategoryById({category_id: category.category_id})
  }
}


export default new CategoryHelper()
