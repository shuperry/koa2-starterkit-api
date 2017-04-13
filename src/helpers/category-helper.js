import _ from 'lodash'

const getCategories = async ({params}) => {
  const {models} = legal

  const {code, parent_id, level, category_id} = params

  let categories
  if (!_.isUndefined(code) || !_.isUndefined(parent_id) || !_.isUndefined(level) || !_.isUndefined(category_id)) {
    const where = {}

    if (!_.isUndefined(code)) where['code'] = code
    if (!_.isUndefined(parent_id)) where['parent_id'] = parent_id
    if (!_.isUndefined(level)) where['level'] = level
    if (!_.isUndefined(category_id)) where['category_id'] = category_id

    categories = await models.Category.find({
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

const getSimpleCategories = async ({params}) => {
  const {models} = legal

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

const getCategoryById = async ({category_id}) => {
  const {models} = legal

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

const getCategoryByCode = async ({code}) => {
  const {models} = legal

  const where = {code}

  return await models.Category.find({
    where
  })
}

const createCategory = async ({params}) => {
  const {models} = legal

  const category = await models.Category.create(params)
  return getCategoryById({category_id: category.category_id})
}

const updateCategory = async ({params, existingCategory}) => {
  const category = await existingCategory.update(params, {fields: existingCategory.attributes})

  return await getCategoryById({category_id: category.category_id})
}

export {getCategories, getSimpleCategories, getCategoryById, getCategoryByCode, createCategory, updateCategory}
