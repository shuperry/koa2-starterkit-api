import _ from 'lodash'

class ServiceUtil {
  constructor() {
  }

  static mapBusiFieldsToObj(params, busiFieldNamess = [], objFieldNamess = []) {
    const mappedParams = params

    if (_.isArray(busiFieldNamess) && _.isArray(objFieldNamess)) {
      busiFieldNamess.forEach((busiFieldName, idx) => {
        if (!!params[busiFieldName]) mappedParams[objFieldNamess[idx]] = params[busiFieldName]
      })
    }

    return mappedParams
  }
}

export default new ServiceUtil()
