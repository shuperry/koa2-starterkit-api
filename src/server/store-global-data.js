import _ from 'lodash'

import categoryHelper from '../helpers/category-helper'

class StoreGlobalDataUtil {
  constructor() {
  }

  static async storeGloabalCategories() {
    let categoriesCodeMap = {},
      categoriesNameMap = {},
      categoriesIdMap = {},
      categoryJson = {}

    const categories = await categoryHelper.getSimpleCategories({})
    categories.forEach(category => {
      categoryJson = JSON.parse(JSON.stringify(category))

      if (!_.isEmpty(categoryJson.code)) {
        categoriesCodeMap[categoryJson.code] = categoryJson
      }
      if (!_.isEmpty(categoryJson.name)) {
        categoriesNameMap[categoryJson.name] = categoryJson
      }
      categoriesIdMap[categoryJson.category_id] = categoryJson
    })

    g_api.categoriesCodeMap = categoriesCodeMap
    g_api.categoriesNameMap = categoriesNameMap
    g_api.categoriesIdMap = categoriesIdMap
  }
}

export default StoreGlobalDataUtil
